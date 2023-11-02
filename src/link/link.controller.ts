import {Body, Controller, Post} from '@nestjs/common';
import {LinkService} from "./link.service";
import {Link} from "./link.entity";

@Controller('link')
export class LinkController {
    constructor(private linkService :LinkService) {
    }

    @Post('create')
    async addLink(@Body() link:Link) {
        await this.linkService.addLink(link);
    }

}
