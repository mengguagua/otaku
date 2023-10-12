import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import {UserService} from "./user.service";
import {UserController} from "./user.controller";

@Module({
    // 使用 forFeature() 方法来定义在当前范围内注册哪些repositories
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    controllers: [UserController],
})
export class UsersModule {}
