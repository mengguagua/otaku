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

    async addLink(link:Link, req: any) {
        // 从token解析得到用户信息，以防万一还是库里再查询确认一次
        let resp = await this.userService.getById(req.user?.sub);
        if (resp) {
            link.userId = resp.id;
            await this.linkRepository.save(link);
            return 'success';
        } else {
            return {
                code: '001',
                message: 'userId不存在',
            };
        }
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

    async getPublic(link:Link) {
        let sql = `select link.id,link.name,url,clickNumber,isPublic,goodNumber,type,userId,link.createTime,DATE_FORMAT(link.updateTime, '%Y-%m-%d %H:%i:%s') as updateTime, user.phone, user.nickName from link left join user on link.userId = user.id where link.deleteFlag is NULL order by goodNumber DESC limit 50`
        if (link.type) {
            sql = `select link.id,link.name,url,clickNumber,isPublic,goodNumber,type,userId,link.createTime,DATE_FORMAT(link.updateTime, '%Y-%m-%d %H:%i:%s') as updateTime, user.phone, user.nickName from link left join user on link.userId = user.id where link.deleteFlag is NULL and type="${link.type}" order by goodNumber DESC limit 50`;
        }
        if (link.name) {
            sql = `select link.id,link.name,url,clickNumber,isPublic,goodNumber,type,userId,link.createTime,DATE_FORMAT(link.updateTime, '%Y-%m-%d %H:%i:%s') as updateTime, user.phone, user.nickName from link left join user on link.userId = user.id where link.deleteFlag is NULL and name like "%${link.name}%" order by goodNumber DESC limit 50`
        }
        if (link.type && link.name) {
            sql = `select link.id,link.name,url,clickNumber,isPublic,goodNumber,type,userId,link.createTime,DATE_FORMAT(link.updateTime, '%Y-%m-%d %H:%i:%s') as updateTime, user.phone, user.nickName from link left join user on link.userId = user.id where link.deleteFlag is NULL and type="${link.type}" and name like "%${link.name}%" order by goodNumber DESC limit 50`
        }
        return await this.linkRepository.query(sql);
    }
}
