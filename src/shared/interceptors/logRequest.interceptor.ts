import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { API_VERSION } from '../core/utils/consts';
import { Als } from '../services/als/als.interface';

const IGNORE_ROUTES = [];

const isTestEnvironment = process.env.NODE_ENV === 'test';

@Injectable()
export class LogRequestInterceptor implements NestInterceptor {
  constructor(private readonly als: Als) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const { method, url, body, params, query } = context.switchToHttp().getRequest();
    const storedRequestId = this.als.getStore().requestId;

    // don't log routes as /health-check or selected routes
    const shouldLogRequest =
      String(url).startsWith(`/v${API_VERSION}`) && !IGNORE_ROUTES.includes(url) && !isTestEnvironment;

    const commonPayload = {
      requestId: storedRequestId ?? uuid(),
      method,
    };

    if (!storedRequestId) {
      this.als.getStore().requestId = commonPayload.requestId;
    }

    if (shouldLogRequest)
      console.info({
        ...commonPayload,
        payload: { method, url, body, params, query },
        service: 'Request - LogRequestInterceptor',
      });

    return next.handle().pipe(
      // log all success responses, errors are logged in the httpException.filter
      map(async (response) => {
        if (shouldLogRequest && method !== 'GET')
          console.info({
            ...commonPayload,
            payload: response,
            service: 'Response - LogRequestInterceptor',
          });

        return response;
      }),
    );
  }
}
