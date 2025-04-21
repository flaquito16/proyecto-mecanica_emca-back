import { Transform } from 'class-transformer';
import { IsNumber, IsString,  MinLength } from 'class-validator';


export class CreateStockDto {
    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()  
    @MinLength(1)
    item: string;
    
    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()  
    @MinLength(1)
    nombre: string;

    @Transform(({ value }) => value ? parseFloat(value) : null)
    @IsNumber()
    cantidad: number;

    @Transform(({ value }) => value ? parseFloat(value) : null)
    @IsNumber()
    precio: number;
}
