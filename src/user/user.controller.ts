import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  UseFilters,
} from '@nestjs/common';
import { Request } from 'express';
import { EditUserDto } from '../dto/edit-user.dto';
import { UserService } from '../user/user.service'
import { HttpExceptionFilter } from '../filter/http-exception.filter';


// @xxx是nextjs框架带有的，叫做decorator(装饰器)
@Controller('user')
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

  @Get('get')
  // @Redirect('https://www.baidu.com', 302) // 可以重定向
  // ParseIntPipe 内置pipe，校验参数是什么类型，不是则报错
  getUserInfo(@Query('id', ParseIntPipe) request: Request) {
  // getUserInfo(@Query() request: Request) {
    return 'hi 获得用户 gaocc'
  }
  @Get('check')
  checkUserInfo(@Query() request: Request) {
    // debugger;
    console.log('request', request);
    throw new ForbiddenException();
  }
  // 默认接收到x-www-form-urlencoded类型到body
  @Post('create')
  // 这个方法报错会经过过滤器
  @UseFilters(new HttpExceptionFilter())
  async creatUserInfo(@Body() userDto: EditUserDto) {
    console.log('creat-userDto', userDto);
    this.userService.createUser(userDto);
    // throw new ForbiddenException();
  }

}
