import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from 'src/users/interfaces/user.interface';
import { IssuesService } from 'src/issues/issues.service';

@Injectable()
export class IssueInterceptor implements NestInterceptor {
  constructor(private issuesService: IssuesService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (req.params.id) {
      const issue = await this.issuesService.findOne(req.params.id);

      if (!issue) {
        throw new NotFoundException('Issue not found');
      }

      if (
        req.user.role === Role.OWNER ||
        req.user.memberships.includes(issue.project)
      ) {
        req.params.id = issue;
      } else {
        throw new ForbiddenException();
      }
    }

    return next.handle();
  }
}
