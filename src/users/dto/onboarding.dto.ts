import { IsString, IsOptional } from 'class-validator';

export class OnboardingDto {
    @IsString()
    userName: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
}
