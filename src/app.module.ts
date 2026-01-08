import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { jwt } from 'twilio';
import { APP_INTERCEPTOR } from '@nestjs/core';



@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),

    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    RedisModule,
  ],
  providers: [],
})
export class AppModule { }