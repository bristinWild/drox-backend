import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityEntity } from 'src/activity/activity.entity';  // Changed to absolute
import { ActivityParticipant } from 'src/activity-participants/activity-participant.entity';  // Changed to absolute
import { ParticipationStatus } from 'src/activity-participants/enums/activity-participant.entity';
import { User } from 'src/users/user.entity';  // Changed to absolute

@Injectable()
export class ActivityParticipantService {
    constructor(
        @InjectRepository(ActivityEntity)
        private readonly activityRepo: Repository<ActivityEntity>,

        @InjectRepository(ActivityParticipant)
        private readonly participantRepo: Repository<ActivityParticipant>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }


    async joinActivity(userId: string, activityId: string) {
        console.log('JOIN REQUEST:', { userId, activityId });

        const activity = await this.activityRepo.findOne({
            where: { id: activityId },
        });

        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }


        if (!user.gender) {
            throw new BadRequestException('Please complete your profile');
        }

        if (!activity) {
            throw new NotFoundException('Activity not found');
        }

        if (activity.createdByUserId === userId) {
            throw new BadRequestException('You cannot join your own activity');
        }

        if (
            activity.maxParticipants !== null &&
            activity.participantCount >= activity.maxParticipants
        ) {
            throw new BadRequestException('This activity is full');
        }

        const existing = await this.participantRepo.findOne({
            where: { activityId, userId },
        });

        if (existing) {
            throw new BadRequestException('Already joined');
        }

        const participant = this.participantRepo.create({
            activityId,
            userId,
            status: activity.isPaid
                ? ParticipationStatus.PENDING
                : ParticipationStatus.JOINED,
        });
        await this.participantRepo.save(participant);


        await this.activityRepo.increment(
            { id: activityId },
            'participantCount',
            1,
        );

        if (user.gender === 'male') {
            await this.activityRepo.increment(
                { id: activityId },
                'maleJoinedCount',
                1,
            );
        }

        if (user.gender === 'female') {
            await this.activityRepo.increment(
                { id: activityId },
                'femaleJoinedCount',
                1,
            );
        }

        return participant;
    }



    async checkJoiningStatus(userId: string, activityId: string) {
        let participant = await this.participantRepo.findOne({
            where: {
                activityId: activityId,
                userId: userId
            }
        });


        if (!participant) {
            return { "hasJoined": false }
        } else {
            return { "hasJoined": true }
        }

    }

    async checkAllBookings(userId: string) {
        let bookedActivities = await this.participantRepo.find({ where: { userId: userId } });

        console.log(bookedActivities)

        if (!bookedActivities) {
            throw new NotFoundException("you didn't booked anything yet")
        } else {
            return bookedActivities;
        }
    }
}