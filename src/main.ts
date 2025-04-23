import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
const requestIp = require('request-ip');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 增加全局的校验管道，校验接口入参字段
  // 使用 request-ip 中间件
  app.use(requestIp.mw());
  await app.listen(3100);
}
bootstrap();
