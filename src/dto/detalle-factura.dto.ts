import { IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProductoDto } from './producto.dto';

export class DetalleFacturaDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  producto_id: number;

  @ValidateNested()
  @Type(() => ProductoDto)
  producto: ProductoDto;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  precio_unitario: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => Number(value))
  subtotal: number;
}