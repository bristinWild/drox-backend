import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const RedisProvider = {
    provide: 'REDIS',
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
        const redisUrl =
            config.get<string>('REDIS_URL') ?? 'redis://localhost:6379';

        return new Redis(redisUrl);
    },
};
