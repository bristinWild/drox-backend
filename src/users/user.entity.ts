import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";
import { Gender } from "src/users/enums/gender.enum";



@Entity('user')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ nullable: true })
    phone?: string;

    @Index({ unique: true })
    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    googleId?: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth?: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isOnboarded: boolean;

    @Column({ nullable: true })
    pinHash?: string;

    @Column({ default: false })
    hasPin: boolean;

    @Column({
        type: 'enum',
        enum: Gender,
        nullable: true,
    })
    gender?: Gender;

    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


}