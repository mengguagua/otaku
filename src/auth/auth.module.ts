import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
@Module({
  imports: [UserModule], // 鉴权需要使用userService内的方法，获取用户信息所以要导入
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
