import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";

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
      return {
        code: '1002',
        message: '手机号已存在',
      }
    }
    await this.usersRepository.save(user);
    return 'success';
  }

  async editUser(user: User) {
    let {id, ...data} = user;
    // 修改表id是id的这条数据，对应字段内容修改为data
    await this.usersRepository.update(id, data);
  }

  async findOne(phone: string): Promise<User | undefined>{
    return this.usersRepository.findOneBy({phone: phone});
  }

  async getById(id: number): Promise<User | undefined>{
    return this.usersRepository.findOneBy({id: id});
  }

}
