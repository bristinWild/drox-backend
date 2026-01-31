import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { ParticipationStatus } from 'src/activity-participants/enums/activity-participant.entity';

@Entity('activity_participant')
@Index(['activityId', 'userId'], { unique: true })
export class ActivityParticipant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    activityId: string;

    @Column()
    userId: string;

    @Column({
        type: 'enum',
        enum: ParticipationStatus,
        default: ParticipationStatus.JOINED,
    })
    status: ParticipationStatus;

    @Column({ default: 0 })
    participantCount: number;


    @Column({ default: false })
    hasPaid: boolean;

    @CreateDateColumn()
    joinedAt: Date;
}
