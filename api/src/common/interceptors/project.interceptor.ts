import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProjectsService } from 'src/projects/projects.service';
import { Role } from 'src/users/interfaces/user.interface';

@Injectable()
export class ProjectInterceptor implements NestInterceptor {
  constructor(private projectsService: ProjectsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (req.params.projectName) {
      const project = await this.projectsService.findOne(
        req.params.projectName
      );

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      if (
        req.user.role === Role.OWNER ||
        req.user.memberships.includes(project._id)
      ) {
        req.params.projectName = project;
      } else {
        throw new ForbiddenException();
      }
    }

    return next.handle();
  }
}
