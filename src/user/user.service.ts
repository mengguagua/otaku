import { Injectable } from '@nestjs/common';
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
    // debugger;
    // let resp = await this.usersRepository.find()
    // return resp;
    return this.usersRepository.find()
  }

  async addUser(user: User) {
    await this.usersRepository.save(user);
  }

  async findOne(phone: string): Promise<User | undefined>{
    return this.usersRepository.findOneBy({phone: phone});
  }

}
