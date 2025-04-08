import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

class CreateProductDto {
    @IsNotEmpty()
    @IsNumber()
    id_stock: number;

    @IsNotEmpty()
    @IsNumber()
    cantidad: number;

    @IsNotEmpty()
    @IsNumber()
    precio: number;
}

export class CreateWorkOrderDto {

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
    @Transform(({ value }) => value ? parseInt(value) : null)
    @IsNumber()
    numeroOrden: number;

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

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductDto)
    productos?: CreateProductDto[];

    @IsNotEmpty()
    @IsNumber()
    truckId: number;

    @IsNotEmpty()
    @IsNumber()
    operatorId: number;
}
