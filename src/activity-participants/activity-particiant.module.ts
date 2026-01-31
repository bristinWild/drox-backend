import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from '../activity/activity.entity';
import { ActivityParticipant } from './activity-participant.entity';
import { ActivityParticipantService } from './activity-participant.service';
import { ParticipationController } from './activity-participant.controller';
import { User } from '../users/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ActivityEntity,
            ActivityParticipant,
            User,
        ]),
    ],
    controllers: [ParticipationController],
    providers: [ActivityParticipantService],
})
export class ActivityParticipantModule { }