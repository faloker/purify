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
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (req.params.id) {
      const user = await this.usersService.findOne({ _id: req.params.id });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (req.user.role === Role.OWNER) {
        req.params.id = user;
      } else {
        throw new ForbiddenException();
      }
    }

    return next.handle();
  }
}
