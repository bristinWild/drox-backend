import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityEntity } from 'src/activity/activity.entity';
import { Repository } from 'typeorm';
import { CreateActivityDto } from 'src/activity/dto/create-activity.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ActivityService {
    constructor(
        @InjectRepository(ActivityEntity)
        private readonly activityRepo: Repository<ActivityEntity>,
    ) { }

    // async create(dto: CreateActivityDto, userId: string) {

    //     if (dto.isPaid && (!dto.fee || dto.fee <= 0)) {
    //         throw new BadRequestException(
    //             'Paid activity must have a valid fee',
    //         );
    //     }

    //     if (!dto.images.length) {
    //         throw new BadRequestException(
    //             'At least one image is required',
    //         );
    //     }

    //     const activity = this.activityRepo.create({
    //         ...dto,
    //         createdByUserId: userId,
    //     });

    //     return this.activityRepo.save(activity);
    // }

    async create(dto: CreateActivityDto, userId?: string) {
        const activity = this.activityRepo.create({
            ...dto,
            createdByUserId: userId ?? 'dev-user',
        });

        return this.activityRepo.save(activity);
    }
}
