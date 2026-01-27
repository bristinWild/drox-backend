import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CreateActivityDto } from 'src/activity/dto/create-activity.dto';
import { ActivityService } from 'src/activity/activity.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('activity')
export class ActivityController {

    constructor(private readonly activityService: ActivityService) { }

    @Post("/")
    @UseGuards(JwtAuthGuard)
    createActivity(
        @Body() dto: CreateActivityDto,
        @Req() req: any,
    ) {
        console.log('USER:', req.user);

        const userId = req.user?.id ?? 'dev-user';
        console.log('Using userId:', userId);

        return this.activityService.create(dto, userId);
    }

}
