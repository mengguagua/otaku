import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import {UserService} from "./user.service";
import {UserController} from "./user.controller";

@Module({
    // 使用 forFeature() 方法来定义在当前范围内注册哪些repositories
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    exports: [UserService], // 设置导出，为了在其它模块中使用，比如鉴权模块ath
    controllers: [UserController],
})
export class UserModule {}
