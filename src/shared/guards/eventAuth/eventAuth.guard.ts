import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { ValidateEventAccess } from '@/module/event/domain/event/services/validateEventAccess/validateEventAccess.service';

@Injectable()
export class EventAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly validateEventAccess: ValidateEventAccess,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return false;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('jwt.secret'),
      });

      const eventId = payload.sub;

      if (!eventId) {
        return false;
      }

      const event = await this.validateEventAccess.execute(eventId);

      if (!event) {
        return false;
      }

      request.event = event;
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
