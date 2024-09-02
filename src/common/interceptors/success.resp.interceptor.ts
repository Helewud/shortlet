import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { RespBase } from '../utils';

@Injectable()
export class SuccessRespInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof RespBase) {
          const d = typeof data.data === 'object' ? data?.data : null;

          return {
            status: 'success',
            message: data?.message,
            data: d,
          };
        }

        return {
          status: 'success',
          data: data,
        };
      }),
    );
  }
}
