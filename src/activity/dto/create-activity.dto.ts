import {
    IsString,
    IsBoolean,
    IsOptional,
    IsNumber,
    IsArray,
    ValidateNested,
    IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;
}

export class CreateActivityDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsBoolean()
    isPaid: boolean;

    @IsOptional()
    @IsNumber()
    fee?: number;

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;
}
