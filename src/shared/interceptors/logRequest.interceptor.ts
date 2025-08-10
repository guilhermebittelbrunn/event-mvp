import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import UniqueEntityID from '../core/domain/UniqueEntityID';
import { API_VERSION } from '../core/utils/consts';
import { Als } from '../services/als/als.interface';

import { RegisterLogService } from '@/module/shared/domain/log/service/registerLog/registerLog.service';

const IGNORE_ROUTES = [];

const isTestEnvironment = process.env.NODE_ENV === 'test';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  constructor(
    private readonly als: Als,
    private readonly registerLogService: RegisterLogService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { method, url, body, params, query } = context.switchToHttp().getRequest();
    const storedRequestId = this.als.getStore().requestId;

    // don't log routes as /health-check or selected routes
    const shouldLogRequest =
      String(url).startsWith(`/v${API_VERSION}`) && !IGNORE_ROUTES.includes(url) && !isTestEnvironment;

    const commonPayload = {
      requestId: storedRequestId ?? UniqueEntityID.create(),
      method,
    };

    if (!storedRequestId) {
      this.als.getStore().requestId = commonPayload.requestId;
    }

    if (shouldLogRequest)
      await this.registerLogService.execute({
        ...commonPayload,
        payload: { method, url, body, params, query },
        service: 'LogRequestInterceptorRequest',
      });

    return next.handle().pipe(
      // log all success responses, errors are logged in the httpException.filter
      map(async (response) => {
        if (shouldLogRequest && method !== 'GET')
          await this.registerLogService.execute({
            ...commonPayload,
            payload: response,
            service: 'LogRequestInterceptorResponse',
          });

        return response;
      }),
    );
  }
}
