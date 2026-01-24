import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/users/user.entity";
import * as bcrypt from "bcrypt";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async findByPhone(phone: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { phone } });
    }

    async createWithPhone(phone: string): Promise<User> {
        const user = this.userRepo.create({
            phone,
            isActive: true,
            isOnboarded: false,
        });

        return this.userRepo.save(user);
    }

    async findOrCreateByPhone(phone: string): Promise<User> {
        let user = await this.findByPhone(phone);

        if (!user) {
            user = await this.createWithPhone(phone)
        }
        return user;
    }

    async findById(id: string): Promise<User | null> {
        let user = await this.userRepo.findOne({ where: { id } })
        return user;
    }

    async createOnboarding(id: string, userName: string, bio?: string, avatarUrl?: string): Promise<User> {
        let user = await this.findById(id);
        if (!user) {
            throw new Error("Please Verify your login first")
        }
        user.name = userName;

        if (bio !== undefined) {
            user.bio = bio;
        }

        if (avatarUrl !== undefined) {
            user.avatarUrl = avatarUrl;
        }

        user.isOnboarded = true

        return this.userRepo.save(user)
    }

    async setPin(userId: string, pin: string): Promise<void> {
        const user = await this.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const hash = await bcrypt.hash(pin, 10);
        user.pinHash = hash;
        user.hasPin = true;

        await this.userRepo.save(user);
    }

    async verifyPin(phone: string, pin: string): Promise<User> {
        const user = await this.findByPhone(phone);

        if (!user || !user.hasPin || !user.pinHash) {
            throw new Error("PIN not set");
        }

        const isValid = await bcrypt.compare(pin, user.pinHash);
        if (!isValid) {
            throw new Error("Invalid PIN");
        }

        return user;
    }





}