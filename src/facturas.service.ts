import { Injectable, ConflictException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Factura, FacturaDocument } from './schemas/factura.schema';
import { RecibirFacturaDto } from './dto/recibir-factura.dto';
import { ListarFacturasQueryDto } from './dto/listar-facturas-query.dto';
import { 
  FacturaListResponse, 
  FacturaCreationResponse, 
  FacturaFilters,
  PaginationMetadata 
} from './interfaces/factura.interfaces';
import { 
  PAGINATION_CONSTANTS, 
  HTTP_STATUS_MESSAGES, 
  MONGO_ERROR_CODES 
} from './constants/app.constants';

@Injectable()
export class FacturasService {
  private readonly logger = new Logger(FacturasService.name);

  constructor(
    @InjectModel(Factura.name) private readonly facturaModel: Model<FacturaDocument>,
  ) {}

  async recibirFactura(recibirFacturaDto: RecibirFacturaDto): Promise<FacturaCreationResponse> {
    const { data } = recibirFacturaDto;
    
    this.logger.log(`Procesando factura ID: ${data.id}, Número: ${data.numero_factura}`);

    try {
      // Verificar duplicados de manera optimizada con una sola consulta
      await this.validarFacturaUnica(data.id, data.numero_factura);

      const facturaData = this.prepararDatosFactura(data);
      const factura = await this.crearFactura(facturaData);

      this.logger.log(`Factura creada exitosamente: ${factura._id}`);

      return this.buildSuccessResponse(factura, data.numero_factura);
    } catch (error) {
      this.logger.error(`Error al procesar factura: ${error.message}`, error.stack);
      
      if (error instanceof ConflictException) {
        throw error;
      }

      // Manejar errores de duplicación a nivel de base de datos
      if (error.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
        throw this.handleDuplicateKeyError(error);
      }

      throw new InternalServerErrorException(HTTP_STATUS_MESSAGES.INTERNAL_ERROR);
    }
  }

  async listarFacturas(queryDto: ListarFacturasQueryDto): Promise<FacturaListResponse> {
    const { 
      page = PAGINATION_CONSTANTS.DEFAULT_PAGE, 
      limit = PAGINATION_CONSTANTS.DEFAULT_LIMIT, 
      cliente_id, 
      numero_factura 
    } = queryDto;
    
    this.logger.log(`Listando facturas - Página: ${page}, Límite: ${limit}`);

    try {
      const skip = (page - 1) * limit;
      const filters = this.buildFilters({ cliente_id, numero_factura });

      const [facturas, total] = await Promise.all([
        this.getFacturasWithPagination(filters, skip, limit),
        this.facturaModel.countDocuments(filters)
      ]);

      const metadata = this.buildPaginationMetadata(page, limit, total);

      return { facturas, metadata };
    } catch (error) {
      this.logger.error(`Error al listar facturas: ${error.message}`, error.stack);
      throw new InternalServerErrorException(HTTP_STATUS_MESSAGES.LIST_ERROR);
    }
  }

  // Métodos privados para mejor organización
  private async validarFacturaUnica(id: number, numero_factura: string): Promise<void> {
    const [existePorId, existePorNumero] = await Promise.all([
      this.facturaModel.exists({ id }),
      this.facturaModel.exists({ numero_factura })
    ]);

    if (existePorId) {
      throw new ConflictException(`Ya existe una factura con ID ${id}`);
    }

    if (existePorNumero) {
      throw new ConflictException(`Ya existe una factura con número ${numero_factura}`);
    }
  }

  private prepararDatosFactura(data: any) {
    return {
      ...data,
      fecha_emision: new Date(data.fecha_emision),
    };
  }

  private async crearFactura(facturaData: any): Promise<FacturaDocument> {
    const factura = new this.facturaModel(facturaData);
    return factura.save();
  }

  private buildSuccessResponse(factura: FacturaDocument, numero_factura: string): FacturaCreationResponse {
    return {
      status: 'success',
      message: HTTP_STATUS_MESSAGES.FACTURA_CREATED,
      data: {
        factura_id: String(factura._id),
        numero_factura,
        created_at: new Date().toISOString()
      }
    };
  }

  private buildFilters(queryParams: { cliente_id?: number; numero_factura?: string }): FacturaFilters {
    const filters: FacturaFilters = {};
    
    if (queryParams.cliente_id) {
      filters.cliente_id = queryParams.cliente_id;
    }
    
    if (queryParams.numero_factura) {
      filters.numero_factura = { $regex: queryParams.numero_factura, $options: 'i' };
    }

    return filters;
  }

  private async getFacturasWithPagination(filters: any, skip: number, limit: number) {
    return this.facturaModel
      .find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v -_id')
      .lean()
      .exec();
  }

  private buildPaginationMetadata(page: number, limit: number, total: number): PaginationMetadata {
    const totalPages = Math.ceil(total / limit);
    
    return {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      previousPage: page > 1 ? page - 1 : null
    };
  }

  private handleDuplicateKeyError(error: any): ConflictException {
    const field = Object.keys(error.keyPattern)[0];
    const value = error.keyValue[field];
    return new ConflictException(`Ya existe una factura con ${field}: ${value}`);
  }
}