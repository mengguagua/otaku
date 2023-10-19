import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {
    }

    // 登录验证
    async signIn(phone: string, pass: string): Promise<any> {
        let user = await this.userService.findOne(phone);
        if (user?.password != pass) {
            throw new UnauthorizedException(); // 密码错误
        }
        debugger
        const {password, ...result} = user; // token包含的用户信息去掉密码
        return result;
    }


}
