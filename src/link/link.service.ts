import {HttpException, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Link} from "./link.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/user.entity";
import {UserService} from "../user/user.service";
import enumCode from "../tool/enumCode";

let blackListForGoodNumber = [];

function removeItemAfterDelay(userId, linkId, delay) {
    setTimeout(() => {
        blackListForGoodNumber = blackListForGoodNumber.filter(obj => obj.userId !== userId || obj.linkId !== linkId);
    }, delay);
}

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

    async getLinkById(id: any) {
        let sql = `select id,name,url,clickNumber,isPublic,goodNumber,type from link where id = "${id}" and link.deleteFlag is NULL`;
        let resp = await this.linkRepository.query(sql);
        return resp;
    }

    async getByUserId(link: Link, req: any): Promise<Link[] | undefined> {
        let id = req?.user?.sub;
        let field = `link.id,link.name,url,clickNumber,isPublic,goodNumber,type,userId,link.createTime,DATE_FORMAT(link.updateTime, '%Y-%m-%d %H:%i:%s') as updateTime, user.phone, user.nickName`;
        let sql = `select ${field} from link left join user on link.userId = user.id where userId = ${id} and link.deleteFlag is NULL order by clickNumber desc, updateTime desc;`
        if (link.name) {
            sql = `select ${field} from link left join user on link.userId = user.id where userId = ${id} and link.deleteFlag is NULL and name like "%${link.name}%" order by clickNumber desc, updateTime desc;`
        }
        let resp = await this.linkRepository.query(sql);
        return resp;
    }

    // 软删除会把 @DeleteDateColumn() 定义的列的值改为删除时间（默认是null）。查询时候要判断is Null
    async deleteOne(link: Link) {
        await this.linkRepository.softDelete(link.id);
        return 'success';
    }

    async editById(link:Link) {
        let {id, ...data} = link;
        let dbLink = {
            url: data.url,
            name: data.name,
            type: data.type,
        };
        await this.linkRepository.update(id,dbLink);
        return 'success'
    }

    async changeIsPublicById(link:Link) {
        let {id, ...data} = link;
        let dbLink = {
            isPublic: data.isPublic,
        };
        await this.linkRepository.update(id,dbLink);
        return 'success'
    }

    async changeRankById(link:Link) {
        let {id, ...data} = link;
        let dbLink = {
            clickNumber: data.clickNumber,
        };
        await this.linkRepository.update(id,dbLink);
        return 'success'
    }

    async changeGoodNumberById(link:Link, req: any) {
        blackListForGoodNumber.forEach((item) => {
            if (item.userId === req.user?.sub && item.linkId === link.id) {
                throw new HttpException('频繁点击了～', enumCode.CLICK_QUICK_ERROR);
            }
        });

        let resp = await this.getLinkById(link.id);
        let {id, ...data} = resp[0];
        let dbLink = {
            goodNumber: req.body.likeType ? Number(data.goodNumber) + 1 : Number(data.goodNumber) - 1,
        };
        await this.linkRepository.update(id,dbLink);
        blackListForGoodNumber.push({userId: req.user?.sub, linkId: id});
        removeItemAfterDelay(req.user?.sub, id, 30000);
        return 'success'
    }

    async getPublic(link:Link) {
        let field = `link.id,link.name,url,clickNumber,isPublic,goodNumber,type,userId,link.createTime,DATE_FORMAT(link.updateTime, '%Y-%m-%d %H:%i:%s') as updateTime, user.phone, user.nickName`;

        let sql = `select ${field} from link left join user on link.userId = user.id where link.deleteFlag is NULL and isPublic=1 order by goodNumber DESC,updateTime desc limit 50`
        if (link.type) {
            sql = `select ${field} from link left join user on link.userId = user.id where link.deleteFlag is NULL and isPublic=1 and type="${link.type}" order by goodNumber DESC, updateTime desc limit 50`;
        }
        if (link.name) {
            sql = `select ${field} from link left join user on link.userId = user.id where link.deleteFlag is NULL and isPublic=1 and name like "%${link.name}%" order by goodNumber DESC, updateTime desc limit 50`
        }
        if (link.type && link.name) {
            sql = `select ${field} from link left join user on link.userId = user.id where link.deleteFlag is NULL and isPublic=1 and type="${link.type}" and name like "%${link.name}%" order by goodNumber DESC, updateTime desc limit 50`
        }
        return await this.linkRepository.query(sql);
    }
}
