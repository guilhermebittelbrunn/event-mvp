import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const webhookSecret = this.config.get('stripe.webhookSecret');

    if (!webhookSecret) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-api-secret'] as string | undefined;

    if (signature && signature === webhookSecret) {
      return true;
    }

    return false;
  }
}
