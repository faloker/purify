import Strategy = require('passport-ldapauth');
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      server: {
        url: configService.get<string>('LDAP_URL'),
        bindDN: configService.get<string>('LDAP_BIND_DN'),
        bindCredentials: configService.get<string>('LDAP_BIND_CREDENTIALS'),
        searchBase: configService.get<string>('LDAP_SEARCH_BASE'),
        searchFilter: configService.get<string>('LDAP_SEARCH_FILTER'),
        // to avoid failures with intetnal CA
        tlsOptions: { rejectUnauthorized: false },
      },
    });
  }

  async validate(aduser: any): Promise<any> {
    const user = await this.authService.validateADUser(aduser);
    return user;
  }
}
