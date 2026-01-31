import { IsString, IsOptional, IsDate, IsDateString, IsEnum } from 'class-validator';
import { Gender } from 'src/users/enums/gender.enum';


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

    @IsEnum(Gender)
    gender: Gender;


}
