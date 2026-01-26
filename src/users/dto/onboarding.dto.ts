import { IsString, IsOptional, IsDate, IsDateString } from 'class-validator';


export class OnboardingDto {

    @IsString()
    userName: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;


    @IsDateString()
    dob: Date;


}
