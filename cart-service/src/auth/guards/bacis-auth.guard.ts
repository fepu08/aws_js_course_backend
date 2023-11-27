import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard extends AuthGuard('basic') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // John Doe
    request.user = { id: '784f7153-d829-4e54-bd90-6dd533ff2d24' };
    return true;
  }
}
