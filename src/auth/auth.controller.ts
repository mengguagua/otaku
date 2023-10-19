import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthLoginDto} from "../dto/auth-login.dto";
import {validatePhoneNumber} from '../tool/tool';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('login')
    login(@Body() authLoginDto: AuthLoginDto) {
        if (! validatePhoneNumber(authLoginDto.phone)) {
            return {message: '手机号验证错误'}
        }
        return this.authService.signIn(authLoginDto.phone, authLoginDto.password);
    }


}
