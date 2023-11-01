import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "./constants";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./auth.guard";
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }), // 模块都是先导入再使用，所以JwtModule也一样。
  ], // 鉴权需要使用userService内的方法，获取用户信息所以要导入
  controllers: [AuthController],
  providers: [
    AuthService,
    // 设置全局路由鉴权
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
  exports: [AuthService],
})
export class AuthModule {}
