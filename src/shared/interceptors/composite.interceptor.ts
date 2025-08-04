import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { LogRequestInterceptor } from './logRequest.interceptor';
import { TransformResponseInterceptor } from './transformResponse.interceptor';

@Injectable()
export class CompositeInterceptor implements NestInterceptor {
  constructor(
    private readonly logRequestInterceptor: LogRequestInterceptor,
    private readonly transformResponseInterceptor: TransformResponseInterceptor,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    return this.logRequestInterceptor.intercept(context, {
      handle: () => this.transformResponseInterceptor.intercept(context, next),
    });
  }
}
