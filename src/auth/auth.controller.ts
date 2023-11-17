import {Body, Controller, Get, Post, UseGuards, Request, HttpException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthLoginDto} from "../dto/auth-login.dto";
import {validatePhoneNumber} from '../tool/tool';
import {AuthGuard} from "./auth.guard";
import {Public} from "./decorators/public.decorator";
import enumCode from "../tool/enumCode";

// todo登出，jwt没有登出方法。
// 方案1，加一个redis服务，登录的用户信息放redis里，每次鉴权解析token得到用户信息和redis比较，通过删除redis用户信息来登出
// 方案2，和1同理，把用户信息存在本服务内存里（问题：每次重启服务，token失效）
// 方案3，类似方案1，用本地序列化黑名单文件，替换redis。登录的token放黑名单文件，失效期设置成jwt的token有效期
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    // @Public()自定义装饰器，声明一个元数据，在鉴权判断是否有这个注解，有则跳过鉴权
    @Public()
    @Post('login')
    login(@Body() authLoginDto: AuthLoginDto) {
        if (! validatePhoneNumber(authLoginDto.phone)) {
            let code = enumCode.PHONE_ERROR;
            throw new HttpException('手机号验证错误', code);
            // return {message: '手机号验证错误'}
        }
        return this.authService.signIn(authLoginDto.phone, authLoginDto.password);
    }

    // 测试token是否存在，其实已经在auth.module里声明了全局拦截
    @UseGuards(AuthGuard)
    @Public()
    @Post('userInfo')
    getProfile(@Request() req) {
        return {name: ''};
        // return req.user;
    }

}
