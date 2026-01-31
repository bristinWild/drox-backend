import { Controller, Req, Param, Post, UseGuards } from '@nestjs/common';
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
}
