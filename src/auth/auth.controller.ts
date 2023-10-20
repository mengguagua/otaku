import {Body, Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthLoginDto} from "../dto/auth-login.dto";
import {validatePhoneNumber} from '../tool/tool';
import {AuthGuard} from "./auth.guard";
import {Public} from "./decorators/public.decorator";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    // @Public()自定义装饰器，声明一个元数据，在鉴权判断是否有这个注解，有则跳过鉴权
    @Public()
    @Post('login')
    login(@Body() authLoginDto: AuthLoginDto) {
        if (! validatePhoneNumber(authLoginDto.phone)) {
            return {message: '手机号验证错误'}
        }
        return this.authService.signIn(authLoginDto.phone, authLoginDto.password);
    }

    // 测试token是否存在，其实已经在auth.module里声明了全局拦截
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}
