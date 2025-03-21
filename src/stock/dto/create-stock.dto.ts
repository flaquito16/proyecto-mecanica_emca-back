import { Transform } from 'class-transformer';
import { IsString,  MinLength } from 'class-validator';


export class CreateStockDto {
    @Transform(({ value }) => value.trim())
    @IsString()  
    @MinLength(1)
    nombre: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    cantidad: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    precio: string;
}
