import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import { AllExceptionsFilter } from './filter/all-exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import {UserModule} from "./user/user.module";
import { AuthModule } from './auth/auth.module';
import {FormatterInterceptor} from "./Interceptors/formatter.interceptor";
import { LinkModule } from './link/link.module';
import {Link} from "./link/link.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Gcc@163.com',
      database: 'otaku',
      // timezone: '+08:00', // 设置时区
      dateStrings:true,
      entities: [User, Link],
      synchronize: true, // 指示是否应在每次应用程序启动时自动创建数据库架构。生产中改false
    }),
    UserModule,
    AuthModule,
    LinkModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER, // 设置全局报错拦截器
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatterInterceptor,
    }
  ],
})
// 包含中间件的模块必须实现 NestModule 接口
export class AppModule implements NestModule{
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer): any {
    // forRoutes 需要执行拦截的请求路径。 exclude排除不用拦截的路径
    consumer.apply(LoggerMiddleware).exclude('/login').forRoutes('/');
  }
}
