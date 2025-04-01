import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWorkOrderDto {
    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    area: string;

    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    operario: string;

    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    encargado: string;

    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    responsable: string;

    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    prioridad: string;
    
    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    tipoMantenimiento: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MinLength(1)
    fechaSolicitud: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MinLength(1)
    fechaInicio: string;

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsString()
    @MinLength(1)
    fechaCierre: string;

    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    @IsNumber()
    numeroOrden: string;

    @Transform(({ value }) => value.trim().toUpperCase())
    @IsString()
    @MinLength(1)
    descripcion: string;

    @IsOptional()
    @Transform(({ value }) => value ? parseFloat(value) : null)
    @IsNumber()
    precioInterno: number;

    @IsOptional()
    @Transform(({ value }) => value ? parseFloat(value) : null)
    @IsNumber()
    precioExterno: number;

    @IsOptional()
    @Transform(({ value }) => value ? parseFloat(value) : null)
    @IsNumber()
    precioTotal: number;

    @IsNotEmpty()
    @IsNumber()
    truckId: number;
}
