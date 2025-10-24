import { IsNotEmpty, IsNumber, IsString, IsDateString, Min, ValidateNested, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ClienteDto } from './cliente.dto';
import { DetalleFacturaDto } from './detalle-factura.dto';

export class FacturaDataDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @IsNotEmpty()
  @IsString()
  numero_factura: string;

  @IsNotEmpty()
  @IsDateString()
  fecha_emision: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  total: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  cliente_id: number;

  @ValidateNested()
  @Type(() => ClienteDto)
  cliente: ClienteDto;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  consecutivo_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleFacturaDto)
  detalles: DetalleFacturaDto[];

  @IsNotEmpty()
  @IsString()
  created_at: string;

  @IsNotEmpty()
  @IsString()
  updated_at: string;
}