import { Controller, Post, Body, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from 'src/dto/send-otp.dto';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from 'src/auth/jwt-refresh.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Public()
    @Post('send-otp')
    sendOtp(@Body() dto: SendOtpDto) {
        return this.authService.sendOtp(dto.phone);
    }


    // @Public()
    // @Post('verify-otp')
    // async verifyOtp(@Body() dto: VerifyOtpDto, @Res() res) {
    //     const result = await this.authService.verifyOtp(dto.phone, dto.otp);

    //     res.cookie('refreshToken', result.refreshToken, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === 'production',
    //         sameSite: 'strict',
    //         path: '/auth/refresh',
    //         maxAge: 7 * 24 * 60 * 60 * 1000,
    //     });

    //     return res.json({
    //         accessToken: result.accessToken,
    //         user: result.user,
    //     });
    // }

    @Public()
    @Post('verify-otp')
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        const result = await this.authService.verifyOtp(dto.phone, dto.otp);
        console.log("VERIFY RESPONSE", result);

        return {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken, // 🔥 REQUIRED FOR MOBILE
            user: result.user,
        };
    }


    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Req() req) {
        return {
            message: 'You are authenticated',
            user: req.user,
        };
    }

    @Public()
    @Post('refresh')
    @UseGuards(JwtRefreshGuard)
    refresh(@Req() req) {
        return this.authService.refreshTokens({
            userId: req.user.userId,
            phone: req.user.phone,
            sessionId: req.user.sessionId,
            refreshToken: req.cookies.refreshToken,
        });
    }



}
