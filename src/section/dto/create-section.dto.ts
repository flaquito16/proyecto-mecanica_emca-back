import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreateSectionDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    nombre_seccion: string;
}
