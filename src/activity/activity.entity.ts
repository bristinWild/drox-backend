import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { GenderPolicy } from "src/activity/enums/gender-policy.enum";


@Entity('activity')
export class ActivityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ default: false })
    isPaid: boolean;

    @Column({ type: 'numeric', default: 0 })
    fee?: number;


    @Index('idx_activity_location', { synchronize: false })
    @Column({ type: 'jsonb' })
    location: {
        name: string;
        address: string;
        lat: number;
        lng: number;
    };

    @Column({ type: 'jsonb' })
    images: string[];

    @Column()
    createdByUserId: string;

    @Column({ default: 0 })
    participantCount: number;

    @Column({
        type: 'enum',
        enum: GenderPolicy,
        default: GenderPolicy.ALL,
    })
    genderPolicy: GenderPolicy;

    @Column()
    maxParticipants: number;

    @Column({ default: 0 })
    maleJoinedCount: number;

    @Column({ default: 0 })
    femaleJoinedCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
