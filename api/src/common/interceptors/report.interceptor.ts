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
import { ReportsService } from 'src/reports/reports.service';

@Injectable()
export class ReportInterceptor implements NestInterceptor {
  constructor(private reportsService: ReportsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (req.params.id) {
      const report = await this.reportsService.findOne(req.params.id);

      if (!report) {
        throw new NotFoundException('Report not found');
      }

      if (
        req.user.role === Role.OWNER ||
        req.user.memberships.includes(report.project)
      ) {
        req.params.id = report;
      } else {
        throw new ForbiddenException();
      }
    }

    return next.handle();
  }
}
