import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService // 需要创建token
    ) {}

    // 登录验证
    async signIn(phone: string, pass: string): Promise<any> {
        let user = await this.userService.findOne(phone);
        if (user?.password != pass) {
            throw new UnauthorizedException(); // 密码错误
        }
        const payload = { sub: user.id, username: user.phone }; // 加密，解密后也是拿到这个内容
        // 解构写法，password是user属性，取用后，result这个自定义的对象就是user去掉password后的内容
        const {password, ...result} = user; // token包含的用户信息去掉密码。
        return {
            access_token: await this.jwtService.signAsync(payload), // 创建token
            ...result
        };
    }


}
