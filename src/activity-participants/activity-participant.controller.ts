import { Controller, Req, Param, Post, UseGuards, Get } from '@nestjs/common';
import { ActivityParticipantService } from './activity-participant.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('participation')
export class ParticipationController {
    constructor(
        private readonly activityParticipantService: ActivityParticipantService,
    ) { }

    @Post(':id/join')
    @UseGuards(JwtAuthGuard)
    joinActivity(@Param('id') activityId: string, @Req() req: any,) {
        return this.activityParticipantService.joinActivity(
            req.user.userId,
            activityId,
        );
    }


    @Get(':id/check-status')
    @UseGuards(JwtAuthGuard)
    checkJoiningStatus(@Param('id') activityId: string, @Req() req: any) {
        return this.activityParticipantService.checkJoiningStatus(req.user.userId, activityId);
    }

    @Get(':id/check-status-test')
    @UseGuards(JwtAuthGuard)
    testCheckJoiningStatus(@Param('id') activityId: string, @Req() req: any) {
        const userId = "d49e8956-fd2e-4e0a-80e7-b0e194f69b7e"
        return this.activityParticipantService.checkJoiningStatus(userId, activityId);
    }

    @Get('check-all-bookings')
    @UseGuards(JwtAuthGuard)
    checkAllBookings(@Req() req: any) {
        const userId = req.user.userId;
        console.log(userId)
        return this.activityParticipantService.checkAllBookings(userId);
    }
}
