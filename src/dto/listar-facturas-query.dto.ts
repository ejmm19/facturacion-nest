import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PAGINATION_CONSTANTS } from '../constants/app.constants';

export class ListarFacturasQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser un número' })
  @Min(PAGINATION_CONSTANTS.MIN_PAGE, { message: 'La página debe ser mayor a 0' })
  readonly page?: number = PAGINATION_CONSTANTS.DEFAULT_PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(PAGINATION_CONSTANTS.MIN_LIMIT, { message: 'El límite debe ser mayor a 0' })
  @Max(PAGINATION_CONSTANTS.MAX_LIMIT, { message: `El límite no puede ser mayor a ${PAGINATION_CONSTANTS.MAX_LIMIT}` })
  readonly limit?: number = PAGINATION_CONSTANTS.DEFAULT_LIMIT;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El ID del cliente debe ser un número' })
  @Min(1, { message: 'El ID del cliente debe ser mayor a 0' })
  readonly cliente_id?: number;

  @IsOptional()
  @IsString({ message: 'El número de factura debe ser un string' })
  readonly numero_factura?: string;
}