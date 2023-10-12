import { Injectable } from '@nestjs/common';
import { EditUserDto } from '../dto/edit-user.dto';

@Injectable()
export class UserService {
  private user:any = {};

  createUser(user: EditUserDto) {
    console.log('UserService', user);
    this.user = user;
  }

}
