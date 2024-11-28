import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.role &&
      user.role.id === `${process.env.ADMIN_ROLE}` &&
      user.role.name === 'admin'
    ) {
      return true;
    } else {
      throw new ForbiddenException('Admin role required');
    }
  }
}
