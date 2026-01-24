import { Controller, Get, Patch, Body, Req, UseGuards, Post } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserService } from "src/users/user.service";
import { OnboardingDto } from "src/users/dto/onboarding.dto";
import { UnauthorizedException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";


@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Get('me')
    async getMe(@Req() req) {
        const userId = req.user.userId;
        const user = await this.userService.findById(userId)
        return user;
    }

    @Patch('onboarding')
    async completeOnboarding(@Req() req, @Body() dto: OnboardingDto) {
        const userId = req.user.userId;

        if (!userId) {
            throw new UnauthorizedException();
        }

        return this.userService.createOnboarding(
            userId,
            dto.userName,
            dto.bio,
            dto.avatarUrl,
        );
    }

    @Post("set-pin")
    @UseGuards(JwtAuthGuard)
    async setPin(@Req() req, @Body() body: { pin: string }) {
        const userId = req.user.userId;

        if (!body.pin || body.pin.length !== 6) {
            throw new BadRequestException("PIN must be 6 digits");
        }

        await this.userService.setPin(userId, body.pin);

        return { success: true };
    }


}