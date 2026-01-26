import { Controller, Post, Body, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from 'src/dto/send-otp.dto';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from 'src/auth/jwt-refresh.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/users/user.service';
import { BadRequestException } from '@nestjs/common';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private userService: UserService
    ) { }


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

    @Post("login-pin")
    async loginWithPin(
        @Body() body: { phone: string; pin: string }
    ) {
        const user = await this.userService.verifyPin(body.phone, body.pin);

        if (!user.phone) {
            throw new BadRequestException("User does not have a phone number");
        }

        return this.authService.issueTokensForUser({
            id: user.id,
            phone: user.phone,
        });
    }

    @Post("set-pin")
    @UseGuards(JwtAuthGuard)
    async setPin(
        @Req() req,
        @Body() body: { pin: string },
    ) {
        const userId = req.user.userId;
        const pin = body.pin;

        // 🔒 Validation
        if (!pin || !/^\d{6}$/.test(pin)) {
            throw new BadRequestException("PIN must be exactly 6 digits");
        }

        await this.userService.setPin(userId, pin);

        return { success: true };
    }

    @Post("has-pin")
    async hasPin(
        @Body() body: { phone: string }
    ) {
        const { phone } = body;


        if (!phone) {
            return { exists: false, hasPin: false };
        }

        const user = await this.userService.findByPhone(phone);

        if (!user) {
            return { exists: false, hasPin: false };
        }

        return {
            exists: true,
            hasPin: !!user.hasPin,
        };

    }

}
