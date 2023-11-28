import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import {LinkService} from "./link.service";
import {Link} from "./link.entity";
import {User} from "../user/user.entity";
import {Public} from "../auth/decorators/public.decorator";
import {AuthGuard} from "../auth/auth.guard";

@Controller('link')
export class LinkController {
    constructor(private linkService :LinkService) {
    }

    @Public()
    @Post('getPublic')
    async getPublic(@Body() link:Link) {
        return await this.linkService.getPublic(link);
    }

    @Post('create')
    async addLink(@Body() link:Link, @Request() req) {
        return await this.linkService.addLink(link, req);
    }

    // @UseGuards(AuthGuard)
    @Post('getByUserId')
    async getByUserId(@Body() link:Link, @Request() req) {
        return await this.linkService.getByUserId(link, req);
    }

    @Post('delete')
    async deleteOne(@Body() link:Link) {
        return await this.linkService.deleteOne(link);
    }

    @Post('edit')
    async editById(@Body() link:Link) {
        return await this.linkService.editById(link);
    }

    @Post('changeIsPublic')
    async changeIsPublicById(@Body() link:Link) {
        return await this.linkService.changeIsPublicById(link);
    }

    @Post('changeRank')
    async changeRankById(@Body() link:Link) {
        return await this.linkService.changeRankById(link);
    }

}
