import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class CreateTruckDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    codigo_maquina: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    nombre_maquina: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    codigo_seccion: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    nombre_seccion: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    marca: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    linea: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    fecha_fabricacion: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    comprado: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    modelo: string;
    
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    capacidad_produccion: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    pais_origen: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    fabricado: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    fecha_instalacion: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    numero_serie: string;
}
