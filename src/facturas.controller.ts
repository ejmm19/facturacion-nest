import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Query, 
  HttpCode, 
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { RecibirFacturaDto } from './dto/recibir-factura.dto';
import { ListarFacturasQueryDto } from './dto/listar-facturas-query.dto';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Controller('facturas')
@UseInterceptors(ClassSerializerInterceptor, LoggingInterceptor)
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @Post('recibir')
  @HttpCode(HttpStatus.CREATED)
  async recibirFactura(@Body() recibirFacturaDto: RecibirFacturaDto) {
    return this.facturasService.recibirFactura(recibirFacturaDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listarFacturas(@Query() query: ListarFacturasQueryDto) {
    return this.facturasService.listarFacturas(query);
  }
}