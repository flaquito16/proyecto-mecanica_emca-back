import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    correo: string;
  
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(6)
    contraseña: string;
}
