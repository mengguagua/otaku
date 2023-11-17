import {
  Body,
  Controller,
  Get, HttpException,
  Post,
} from '@nestjs/common';
import { UserService } from '../user/user.service'
import {User} from "./user.entity";
import {Public} from "../auth/decorators/public.decorator";
import {validatePhoneNumber} from "../tool/tool";
import enumCode from "../tool/enumCode";


// @xxx是nextjs框架带有的，叫做decorator(装饰器)
@Controller('user')
// @UseInterceptors(FormatterInterceptor) // 在app.module.ts里全局设置里，单独设置可以用这种方法
export class UserController {
  // UserService 通过类构造函数注入.private 这种简写允许我们立即在同一位置声明和初始化 userService 成员
  constructor(private userService: UserService) {
  }

  @Get('findAllUser')
  findAllUser() {
    let resp = this.userService.findAll();
    console.log('findAllUser', resp);
    return resp;
  };

  @Post('getByPhone')
  // @Redirect('https://www.baidu.com', 302) // 可以重定向
  // ParseIntPipe 内置pipe，校验参数是什么类型，不是则报错
  findOneUser(@Body() user: User) {
    return this.userService.findOne(user.phone);
  }

  @Post('edit')
  checkUserInfo(@Body() user: User) {
    this.userService.editUser(user);
  }

  @Public()
  @Post('create')
  // 这个方法报错会经过过滤器
  // @UseFilters(new HttpExceptionFilter())
  async addUserInfo(@Body() user: User) {
    if (! validatePhoneNumber(user.phone)) {
      throw new HttpException('手机号验证错误', enumCode.PHONE_ERROR);
    }
    return await this.userService.addUser(user);
  }

}
