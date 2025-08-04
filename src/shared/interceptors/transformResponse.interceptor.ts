import { Injectable, NestInterceptor, ExecutionContext, CallHandler, StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Thanks to this interceptor, all responses will be wrapped in a data object.
 * Meta property can be used for pagination info, for example.
 */
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (!response) {
          return {
            data: [],
          };
        }

        if (response instanceof StreamableFile || Buffer.isBuffer(response)) {
          return response;
        }

        if (response.data && response.meta) {
          return {
            data: response.data,
            meta: response.meta,
          };
        }

        return { data: response };
      }),
    );
  }
}
