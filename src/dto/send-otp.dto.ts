import { IsPhoneNumber } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class SendOtpDto {
    @IsPhoneNumber()
    @IsNotEmpty()
    phone: string;
}