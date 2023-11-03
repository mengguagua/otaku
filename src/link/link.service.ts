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
        // private userService: UserService,
    ) {}

    async addLink(link:Link) {
        await this.linkRepository.save(link);
        return 'success';
    }

    async getByUserId(user: User): Promise<Link[] | undefined> {
        let resp = await this.linkRepository.query(`
        select id,name,url,clickNumber,isPublic,goodNumber,type,userId,createTime,updateTime from link where userId = ${user.id} and deleteFlag is NULL order by updateTime desc;
        `);
        return resp;
    }

    // 软删除会把 @DeleteDateColumn() 定义的列的值改为删除时间（默认是null）。查询时候要判断is Null
    async deleteOne(link: Link) {
        await this.linkRepository.softDelete(link.id);
        return 'success';
    }

    async editById(link:Link) {
        let {id, ...data} = link;
        await this.linkRepository.update(id,data);
        return 'success'
    }
}
