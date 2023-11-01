import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : {message:'网络拥堵，稍后再试'};
    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    const time = new Date().toISOString();
    const responseBody = {
      status: 0, // 1正确，0错误
      data: typeof message === 'object'? {...message} : message,
      // statusCode: httpStatus,
      timestamp: time,
      path: path,
    };

    console.log('全局报错：进入AllExceptionsFilter，接口路径：', path, '时间：', time);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
