import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';
export class CreateUserDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    nombre: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    apellido: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    correo: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    contraseña: string;
};
