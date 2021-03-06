/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/user.dto'
import { ProjectsService } from '../projects/projects.service'
import { CreateProjectDto } from '../projects/dto/projects.dto'
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { validateClass } from '../utils/validate';

function filterGroups(groupNames: string[], prefix: string) {
  return groupNames
      .filter((groupName) => groupName.startsWith(prefix))
      .map((groupName) => groupName.slice(prefix.length))
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne({ email, type: 'local' });

    if (
      user &&
      this.usersService.isSecretValid(pass, user.password, user.salt)
    ) {
      return user;
    } else {
      return null;
    }
  }

  async validateADUser(user: any): Promise<User | undefined> {
    const entity = await this.usersService.findOne({
      email: user.uid,
      type: 'ldap',
    });

    if (!entity) {
      // return this.usersService.createUser({
      //   username: user.uid,
      //   password: randomBytes(16).toString('hex'),
      //   email: user.mail,
      //   type: 'ldap',
      // });
    } else {
      return entity;
    }
  }

  async validateTrustedHeaderUser(headers: any): Promise<User> {
    const emailHeader = this.configService.get<string>('TRUSTED_HEADER_EMAIL_HEADER_NAME');
    const editPermissions = this.configService.get<string>('TRUSTED_HEADER_MANAGE_PERMISSIONS') === "true";
    const groupHeader = this.configService.get<string>('TRUSTED_HEADER_GROUP_HEADER_NAME');

    const groupRolePrefix = this.configService.get<string>('TRUSTED_HEADER_GROUP_ROLE_PREFIX') || 'role-';
    const groupProjectPrefix = this.configService.get<string>('TRUSTED_HEADER_GROUP_PROJECT_PREFIX') || 'project-';

    const groupHeaderIsObject = this.configService.get<string>('TRUSTED_HEADER_GROUP_OBJECT_TYPE') === 'true';
    const groupHeaderObjectField = this.configService.get<string>('TRUSTED_HEADER_GROUP_OBJECT_TYPE_FIELD') || 'name';

    if(!(emailHeader in headers)) {
      throw new Error('Missing header - TRUSTED_HEADER_EMAIL_HEADER_NAME');
    }

    if((editPermissions && !(groupHeader in headers))) {
      throw new Error('Missing header - TRUSTED_HEADER_GROUP_HEADER_NAME');
    }

    const email = headers[emailHeader]
    let user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      const createUserDto = {
        email,
        role: 'observer',
        ssoBypass: false,
      }
      await validateClass(CreateUserDto, createUserDto);
      user = await this.usersService.createUser(createUserDto);
    }

    if(editPermissions) {
      const groupString = headers[groupHeader];

      let groupNames = []
      if(groupHeaderIsObject) {
        // Header format: [{"id": "1", "name": "role-admin"},{"id": "2", "name": "project-myproject1"}]
        groupNames = JSON.parse(groupString)
          .map((groupObj) => groupObj[groupHeaderObjectField]);
      } else {
        // Format used by proxies such as oauth2-proxy
        // Header format: "role-observer,project-myproject1,project-myproject2,..."
        groupNames = groupString.split(",");
      }

      let userUpdateRequired = false

      // Extract Roles and check if user needs to be updated
      const roles = filterGroups(groupNames, groupRolePrefix)

      // Get highest privilege role in roles list (if there are multiple)
      const targetRole = ['owner', 'admin', 'user', 'observer'].find((roleString) => roles.includes(roleString)) || 'observer';

      if(user.role !== targetRole){
        userUpdateRequired = true
      }

      // Extract Memberships, create projects and check if user needs to be updated
      const membershipNames: string[] = filterGroups(groupNames, groupProjectPrefix)

      const projects = await this.projectsService.findMany(membershipNames)

      const membershipIds: string[] = await Promise.all(membershipNames.map(async (projectName) => {
        let project = projects.find((project) => project.name === projectName);
        if(!project) {
          const createProjectDto = {
            name: projectName,
            displayName: projectName,
          }

          await validateClass(CreateProjectDto, createProjectDto);
          project = await this.projectsService.create(createProjectDto);
        }
        return project._id
      }))

      const userCurrentMemberships = (user.memberships || []).slice().sort();
      const userTargetMemberships = membershipIds.slice().sort();

      if(
        userTargetMemberships.length !== userCurrentMemberships.length ||
        !(userTargetMemberships.every((value, index) => value === userCurrentMemberships[index]))
      ) {
        userUpdateRequired = true
      }

      // Update user role & memberships if needed
      if(userUpdateRequired) {
        await this.usersService.editUser(user._id, {
          name: user.name,
          email: user.email,
          ssoBypass: false,
          role: targetRole,
          memberships: userTargetMemberships,
        })

        user = await this.usersService.findOne({
          email,
        });
      }
    }

    return user;
  }

  async validateSAMLUser(user: any) {
    const doc = await this.usersService.findOne({
      email: user[this.configService.get<string>('SAML_EMAIL_FIELD_NAME')],
    });
    if (doc) {
      return doc;
    } else {
      throw new NotFoundException('No such user');
    }
  }

  async generateUserTokens(user: User) {
    const refreshToken = this.jwtService.sign(
      { _id: user._id, type: 'refreshToken' },
      { expiresIn: this.configService.get<string>('JWT_TOKEN_EXPIRY') || '72h' }
    );
    await this.usersService.saveRefreshToken(user._id, refreshToken);

    return {
      accessToken: this.jwtService.sign({
        _id: user._id,
        role: user.role,
        memberships: user.memberships,
        ssoBypass: user.ssoBypass,
        type: 'accessToken',
      }),
      refreshToken,
    };
  }

  async refreshUserTokens(token: string) {
    const { _id, type } = await this.jwtService.verify(token);

    if (
      type === 'refreshToken' &&
      this.usersService.validateRefreshToken(_id, token)
    ) {
      const user = await this.usersService.findOne({ _id });
      return this.generateUserTokens(user)
    } else {
      throw new Error('Invalid refresh token');
    }
  }

  async removeRefreshToken(user: User) {
    await this.usersService.removeRefreshToken(user);
  }
}
