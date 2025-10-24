import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { RecibirFacturaDto } from './dto/recibir-factura.dto';
import { ListarFacturasQueryDto } from './dto/listar-facturas-query.dto';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

describe('FacturasController', () => {
  let controller: FacturasController;
  let service: FacturasService;

  const mockFacturasService = {
    recibirFactura: jest.fn(),
    listarFacturas: jest.fn(),
  };

  const mockFacturaResponse = {
    status: 'success',
    message: 'Factura registrada exitosamente en el sistema',
    data: {
      factura_id: '507f1f77bcf86cd799439011',
      numero_factura: 'FAC-001',
      created_at: '2025-10-24T10:00:00.000Z'
    }
  };

  const mockListaFacturasResponse = {
    facturas: [
      {
        _id: '507f1f77bcf86cd799439011',
        id: 1,
        numero_factura: 'FAC-001',
        total: 100.00,
        cliente: {
          nombre: 'Juan Pérez',
          email: 'juan@ejemplo.com'
        }
      }
    ],
    metadata: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      previousPage: null
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacturasController],
      providers: [
        {
          provide: FacturasService,
          useValue: mockFacturasService,
        },
        LoggingInterceptor,
      ],
    }).compile();

    controller = module.get<FacturasController>(FacturasController);
    service = module.get<FacturasService>(FacturasService);

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('recibirFactura', () => {
    const validFacturaDto: RecibirFacturaDto = {
      data: {
        id: 1,
        numero_factura: 'FAC-001',
        fecha_emision: '2025-10-24T10:00:00.000Z',
        total: 100.00,
        cliente_id: 123,
        consecutivo_id: 1001,
        cliente: {
          id: 123,
          nombre: 'Juan Pérez',
          email: 'juan@ejemplo.com',
          telefono: '555-1234',
          direccion: 'Calle 123',
          identificacion: '12345678',
          created_at: '2025-10-24T10:00:00.000Z',
          updated_at: '2025-10-24T10:00:00.000Z'
        },
        detalles: [{
          id: 1,
          cantidad: 1,
          precio_unitario: 100.00,
          subtotal: 100.00,
          producto_id: 1,
          producto: {
            id: 1,
            nombre: 'Producto Test',
            codigo: 'PROD-001',
            precio_unitario: 100.00,
            descripcion: 'Producto de prueba',
            created_at: '2025-10-24T10:00:00.000Z',
            updated_at: '2025-10-24T10:00:00.000Z'
          }
        }],
        created_at: '2025-10-24T10:00:00.000Z',
        updated_at: '2025-10-24T10:00:00.000Z'
      }
    };

    it('debería recibir una factura exitosamente', async () => {
      // Arrange
      mockFacturasService.recibirFactura.mockResolvedValue(mockFacturaResponse);

      // Act
      const result = await controller.recibirFactura(validFacturaDto);

      // Assert
      expect(service.recibirFactura).toHaveBeenCalledWith(validFacturaDto);
      expect(result).toEqual(mockFacturaResponse);
    });

    it('debería llamar al servicio con los datos correctos', async () => {
      // Arrange
      mockFacturasService.recibirFactura.mockResolvedValue(mockFacturaResponse);

      // Act
      await controller.recibirFactura(validFacturaDto);

      // Assert
      expect(service.recibirFactura).toHaveBeenCalledTimes(1);
      expect(service.recibirFactura).toHaveBeenCalledWith(validFacturaDto);
    });

    it('debería propagar errores del servicio', async () => {
      // Arrange
      const error = new Error('Service error');
      mockFacturasService.recibirFactura.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.recibirFactura(validFacturaDto))
        .rejects
        .toThrow('Service error');
    });
  });

  describe('listarFacturas', () => {
    it('debería listar facturas con parámetros por defecto', async () => {
      // Arrange
      const queryDto: ListarFacturasQueryDto = {};
      mockFacturasService.listarFacturas.mockResolvedValue(mockListaFacturasResponse);

      // Act
      const result = await controller.listarFacturas(queryDto);

      // Assert
      expect(service.listarFacturas).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockListaFacturasResponse);
    });

    it('debería listar facturas con parámetros de consulta', async () => {
      // Arrange
      const queryDto: ListarFacturasQueryDto = {
        page: 2,
        limit: 5,
        cliente_id: 123,
        numero_factura: 'FAC'
      };
      mockFacturasService.listarFacturas.mockResolvedValue(mockListaFacturasResponse);

      // Act
      const result = await controller.listarFacturas(queryDto);

      // Assert
      expect(service.listarFacturas).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(mockListaFacturasResponse);
    });

    it('debería manejar consultas vacías', async () => {
      // Arrange
      const queryDto: ListarFacturasQueryDto = {};
      const emptyResponse = {
        facturas: [],
        metadata: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
          nextPage: null,
          previousPage: null
        }
      };
      mockFacturasService.listarFacturas.mockResolvedValue(emptyResponse);

      // Act
      const result = await controller.listarFacturas(queryDto);

      // Assert
      expect(service.listarFacturas).toHaveBeenCalledWith(queryDto);
      expect(result.facturas).toEqual([]);
      expect(result.metadata.totalItems).toBe(0);
    });

    it('debería propagar errores del servicio en listado', async () => {
      // Arrange
      const queryDto: ListarFacturasQueryDto = {};
      const error = new Error('Database connection error');
      mockFacturasService.listarFacturas.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.listarFacturas(queryDto))
        .rejects
        .toThrow('Database connection error');
    });
  });

  describe('decoradores HTTP', () => {
    it('debería tener el decorador @Post para recibirFactura', () => {
      const metadata = Reflect.getMetadata('path', controller.recibirFactura);
      expect(metadata).toBe('recibir');
    });

    it('debería tener el decorador @Get para listarFacturas', () => {
      const metadata = Reflect.getMetadata('path', controller.listarFacturas);
      expect(metadata).toBe('/');
    });
  });
});