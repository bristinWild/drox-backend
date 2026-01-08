import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.refreshToken,
            ]),
            secretOrKey: config.get<string>('JWT_SECRET'),
        });
    }

    validate(payload: any) {
        return {
            userId: payload.sub,
            phone: payload.phone,
            sessionId: payload.sid,
        };
    }
}
