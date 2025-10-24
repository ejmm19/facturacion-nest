import { IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ListarFacturasDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  cliente_id?: number;
}