import { IsOptional, IsString, MaxLength } from "class-validator";

export class EditProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(32)
    username?: string;

    @IsOptional()
    @IsString()
    @MaxLength(160)
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
}