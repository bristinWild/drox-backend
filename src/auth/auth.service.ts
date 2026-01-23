import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        @Inject('REDIS') private redis: any,
        @Inject('TWILIO') private twilio: any,
        private config: ConfigService,
        private jwt: JwtService,
        private readonly userService: UserService,
    ) { }



    async sendOtp(phone: string) {
        const cooldownKey = `otp:cooldown:${phone}`;
        const isCooling = await this.redis.get(cooldownKey);

        if (isCooling) {
            throw new BadRequestException(
                'Please wait before requesting another OTP',
            );
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await this.redis.set(`otp:${phone}`, otp, 'EX', 300);
        await this.redis.set(cooldownKey, '1', 'EX', 60); // 60s cooldown

        await this.twilio.messages.create({
            to: phone,
            from: this.config.get('TWILIO_PHONE_NUMBER'),
            body: `Your verification code is ${otp}`,
        });

        return { success: true, cooldown: 60 };
    }


    async verifyOtp(phone: string, otp: string) {
        const key = `otp:${phone}`;
        const savedOtp = await this.redis.get(key);

        if (!savedOtp || savedOtp !== otp) {
            throw new UnauthorizedException('Invalid OTP');
        }

        await this.redis.del(key);

        const user = await this.userService.findOrCreateByPhone(phone);

        const tokens = await this.generateTokens({
            id: user.id,
            phone: user.phone || phone,
        })

        return {
            ...tokens,
            user,
        };
    }

    private async generateTokens(user: { id: string; phone: string }) {

        const payload = {
            sub: user.id,
            phone: user.phone,
        };

        const accessToken = this.jwt.sign(payload, {
            expiresIn: '15m',
        });

        const refreshToken = this.jwt.sign(payload, {
            expiresIn: '7d',
        });

        return {
            accessToken,
            refreshToken,
        };

    }

    private async storeRefreshToken(
        userId: string,
        sessionId: string,
        refreshToken: string,
    ) {
        const hash = await bcrypt.hash(refreshToken, 10);

        await this.redis.set(`refresh:${userId}:${sessionId}`, hash, 'EX', 7 * 24 * 60 * 60,);
    }

    private async validateRefreshToken(
        userId: string,
        sessionId: string,
        refreshToken: string,
    ) {
        const key = `refresh:${userId}:${sessionId}`;
        const storedHash = await this.redis.get(key);

        if (!storedHash) {
            throw new UnauthorizedException('Refresh token revoked');
        }

        const isValid = await bcrypt.compare(refreshToken, storedHash);

        if (!isValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async refreshTokens(payload: {
        userId: string;
        phone: string;
        sessionId: string;
        refreshToken: string;
    }) {
        // 🔐 validate refresh token
        await this.validateRefreshToken(payload.userId, payload.sessionId, payload.refreshToken);

        await this.redis.del(
            `refresh:${payload.userId}:${payload.sessionId}`,
        );

        return this.generateTokens({
            id: payload.userId,
            phone: payload.phone,
        });
    }

}
