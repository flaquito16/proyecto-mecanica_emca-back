import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreateOperatorDto {
    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    nombreO: string;
}
