import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";



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

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isOnboarded: boolean;

    /** Flexible future data */
    @Column({ type: 'jsonb', nullable: true })
    metadata?: Record<string, any>;

    /** Audit */
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;




}