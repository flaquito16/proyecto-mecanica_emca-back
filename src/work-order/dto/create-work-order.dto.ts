import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWorkOrderDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    area: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    operario: string;

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(1)
    encargado: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    responsable: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    prioridad: string;
    
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    tipoMantenimiento: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    fechaSolicitud: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    fechaInicio: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    fechaCierre: string;

    @IsOptional()
    @Transform(({value}) => value.trim())
    @IsNumber()
    numeroOrden: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    descripcion: string;

    @IsNotEmpty()
    @IsNumber()
    truckId: number;

}
