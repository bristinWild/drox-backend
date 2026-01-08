import { IsString, Length, IsPhoneNumber } from 'class-validator';

export class VerifyOtpDto {
    @IsPhoneNumber()
    phone: string;

    @IsString()
    @Length(6, 6)
    otp: string;
}
