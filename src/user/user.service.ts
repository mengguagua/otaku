import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import enumCode from "../tool/enumCode";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async addUser(user: User) {
    let res = await this.usersRepository.findOneBy({phone: user.phone});
    if (res) {
      throw new HttpException('手机号已存在', enumCode.PHONE_EXIST);
    }
    await this.usersRepository.save(user);
    return 'success';
  }

  async editUser(user: User, req: any) {
    let {id, ...data} = user;
    let userId = req.user?.sub;
    // 取token的id，修改表内容为data
    await this.usersRepository.update(userId, data);
  }

  async findOne(phone: string): Promise<User | undefined>{
    return this.usersRepository.findOneBy({phone: phone});
  }

  async getById(id: number): Promise<User | undefined>{
    return this.usersRepository.findOneBy({id: id});
  }

}
