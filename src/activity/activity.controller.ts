import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
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
        // const userId = 'dev-user'; (i use this for testing)
        const userId = req.user?.userId;
        console.log('Using userId:', userId);

        return this.activityService.create(dto, userId);
    }

    @Get("/")
    @UseGuards(JwtAuthGuard)
    async getAllActivity() {
        return await this.activityService.getAllActivity()
    }

    @Get("/user/activities")
    @UseGuards(JwtAuthGuard)
    async getActivitiesForSpecificUser(@Req() req: any) {
        let userid = req.user.userId;
        console.log(userid);
        return await this.activityService.getUserActivity(userid);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    async getActivityInfo(@Param('id') activityId: string) {
        return await this.activityService.getActivityById(activityId);
    }

}
