import { ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { FacturaDataDto } from './factura-data.dto';

export class RecibirFacturaDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FacturaDataDto)
  data: FacturaDataDto;
}