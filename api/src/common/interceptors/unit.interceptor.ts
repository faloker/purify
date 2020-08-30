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
import { UnitsService } from 'src/units/units.service';
import { Project } from 'src/projects/interfaces/project.interface';

@Injectable()
export class UnitInterceptor implements NestInterceptor {
  constructor(private unitsService: UnitsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (req.params.unitName) {
      const unit = await this.unitsService.findOne(req.params.unitName);

      if (!unit) {
        throw new NotFoundException('Unit not found');
      }

      if (
        req.user.role === Role.OWNER ||
        req.user.memberships.includes(unit.project)
      ) {
        req.params.unitName = unit;
      } else {
        throw new ForbiddenException();
      }
    }

    return next.handle();
  }
}
