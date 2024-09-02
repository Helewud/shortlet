import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch()
export class ErrorRespInterceptor implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    console.error(exception);

    const { httpAdapter } = this.httpAdapterHost;

    const resp = {
      status: 'error',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong, please try again later',
    };

    const ctx = host.switchToHttp();

    if (exception instanceof HttpException) {
      resp.message = exception.message;

      const eResp = exception.getResponse();
      if (eResp.valueOf().hasOwnProperty('message')) {
        resp.message = String(eResp['message']);
      }
      resp.code = exception.getStatus();
    }

    if (exception instanceof QueryFailedError) {
      if (exception?.driverError?.code == '23505') {
        const s = exception?.driverError?.detail.split('=') as string;

        resp.message = s[0].slice(4) + ' already exist.';
        resp.code = HttpStatus.BAD_REQUEST;
      }
    }

    httpAdapter.reply(ctx.getResponse(), resp, resp.code);
  }
}
