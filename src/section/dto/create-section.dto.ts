import { Transform } from 'class-transformer';
import { IsEmpty, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateSectionDto {

    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    codigo: string;

    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    nombre: string;
    
    @IsNotEmpty()
    @IsNumber()
    truckId: number; // Cambiado a truckId para mantener la consistencia con el DTO de Truck

}
