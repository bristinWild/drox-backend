import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityEntity } from 'src/activity/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityEntity])],
  providers: [ActivityService],
  controllers: [ActivityController],
  exports: [ActivityService]
})
export class ActivityModule { }
