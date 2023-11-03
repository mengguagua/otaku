import {Body, Controller, Post} from '@nestjs/common';
import {LinkService} from "./link.service";
import {Link} from "./link.entity";
import {User} from "../user/user.entity";

@Controller('link')
export class LinkController {
    constructor(private linkService :LinkService) {
    }

    @Post('create')
    async addLink(@Body() link:Link) {
        return await this.linkService.addLink(link);
    }

    @Post('getByUserId')
    async getByUserId(@Body() user:User) {
        return await this.linkService.getByUserId(user);
    }

    @Post('delete')
    async deleteOne(@Body() link:Link) {
        return await this.linkService.deleteOne(link);
    }

    @Post('edit')
    async editById(@Body() link:Link) {
        return await this.linkService.editById(link);
    }

}
