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

    async findByHost(createdByUserId: string): Promise<ActivityEntity[] | null> {
        return this.activityRepo.find({ where: { createdByUserId } });
    }

    async create(dto: CreateActivityDto, userId?: string) {
        const activity = this.activityRepo.create({
            ...dto,
            createdByUserId: userId ?? 'dev-user',
        });

        return this.activityRepo.save(activity);
    }

    async getAllActivity() {
        const allData = await this.activityRepo.find();
        console.log(allData);
        return allData;
    }

    async getUserActivity(createdByUserId: string) {
        const activities = await this.findByHost(createdByUserId);
        return activities;
    }
}
