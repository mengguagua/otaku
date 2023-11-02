import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {Link} from "./link.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/user.entity";
import {UserService} from "../user/user.service";

@Injectable()
export class LinkService {
    constructor(
        @InjectRepository(Link)
        private linkRepository:Repository<Link>,
        private userService: UserService,
    ) {}

    async addLink(link:Link) {
        link.user = await this.userService.getById(link.userId);
        await this.linkRepository.save(link);
        return 'success';
    }
}
