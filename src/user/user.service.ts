import { Injectable } from '@nestjs/common';
import { EditUserDto } from '../dto/edit-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {}

  private user:any = {};

  createUser(user: EditUserDto) {
    console.log('UserService', user);
    this.user = user;
  }

  async findAll(): Promise<User[]> {
    // debugger;
    // let resp = await this.usersRepository.find()
    // return resp;
    return this.usersRepository.find()
  }

}
