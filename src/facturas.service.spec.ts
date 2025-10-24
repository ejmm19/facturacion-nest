import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { FacturasService } from './facturas.service';
import { Factura, FacturaDocument } from './schemas/factura.schema';
import { RecibirFacturaDto } from './dto/recibir-factura.dto';
import { ListarFacturasQueryDto } from './dto/listar-facturas-query.dto';
import { MONGO_ERROR_CODES } from './constants/app.constants';

describe('FacturasService', () => {
  let service: FacturasService;
  let model: Model<FacturaDocument>;

  const mockFactura = {
    _id: '507f1f77bcf86cd799439011',
    id: 1,
    numero_factura: 'FAC-001',
    fecha_emision: new Date('2025-10-24'),
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
    updated_at: '2025-10-24T10:00:00.000Z',
    createdAt: new Date('2025-10-24'),
    updatedAt: new Date('2025-10-24'),
    save: jest.fn().mockResolvedValue(this)
  };

  const mockFacturaModel = jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(mockFactura)
  }));

  // Agregar métodos estáticos al mock
  Object.assign(mockFacturaModel, {
    find: jest.fn(),
    findOne: jest.fn(),
    exists: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacturasService,
        {
          provide: getModelToken(Factura.name),
          useValue: mockFacturaModel,
        },
      ],
    }).compile();

    service = module.get<FacturasService>(FacturasService);
    model = module.get<Model<FacturaDocument>>(getModelToken(Factura.name));

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        cliente: mockFactura.cliente,
        detalles: mockFactura.detalles,
        created_at: '2025-10-24T10:00:00.000Z',
        updated_at: '2025-10-24T10:00:00.000Z'
      }
    };

    it('debería crear una factura exitosamente', async () => {
      // Arrange
      mockFacturaModel.exists = jest.fn().mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue(mockFactura);
      
      // Mock del constructor de Mongoose
      mockFacturaModel.mockImplementation(() => ({
        save: mockSave,
        _id: mockFactura._id
      }));

      // Act
      const result = await service.recibirFactura(validFacturaDto);

      // Assert
      expect(mockFacturaModel.exists).toHaveBeenCalledTimes(2);
      expect(result.status).toBe('success');
      expect(result.data.numero_factura).toBe(validFacturaDto.data.numero_factura);
    });

    it('debería lanzar ConflictException si el ID ya existe', async () => {
      // Arrange
      mockFacturaModel.exists = jest.fn()
        .mockResolvedValueOnce({ _id: 'some-id' }) // ID existe
        .mockResolvedValueOnce(null); // Número no existe

      // Act & Assert
      await expect(service.recibirFactura(validFacturaDto))
        .rejects
        .toThrow(ConflictException);
      
      expect(mockFacturaModel.exists).toHaveBeenCalledWith({ id: validFacturaDto.data.id });
    });

    it('debería lanzar ConflictException si el número de factura ya existe', async () => {
      // Arrange
      mockFacturaModel.exists = jest.fn()
        .mockResolvedValueOnce(null) // ID no existe
        .mockResolvedValueOnce({ _id: 'some-id' }); // Número existe

      // Act & Assert
      await expect(service.recibirFactura(validFacturaDto))
        .rejects
        .toThrow(ConflictException);
      
      expect(mockFacturaModel.exists).toHaveBeenCalledWith({ 
        numero_factura: validFacturaDto.data.numero_factura 
      });
    });

    it('debería manejar errores de duplicación de MongoDB', async () => {
      // Arrange
      mockFacturaModel.exists = jest.fn().mockResolvedValue(null);
      const duplicateError = {
        code: MONGO_ERROR_CODES.DUPLICATE_KEY,
        keyPattern: { numero_factura: 1 },
        keyValue: { numero_factura: 'FAC-001' }
      };
      
      const mockSave = jest.fn().mockRejectedValue(duplicateError);
      
      // Mock para simular la creación de una instancia del modelo
      mockFacturaModel.mockImplementation(() => ({
        save: mockSave
      }));

      // Act & Assert
      await expect(service.recibirFactura(validFacturaDto))
        .rejects
        .toThrow(ConflictException);
    });

    it('debería lanzar InternalServerErrorException para errores desconocidos', async () => {
      // Arrange
      mockFacturaModel.exists = jest.fn().mockResolvedValue(null);
      const unknownError = new Error('Unknown database error');
      
      const mockSave = jest.fn().mockRejectedValue(unknownError);
      
      // Mock para simular la creación de una instancia del modelo
      mockFacturaModel.mockImplementation(() => ({
        save: mockSave
      }));

      // Act & Assert
      await expect(service.recibirFactura(validFacturaDto))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('listarFacturas', () => {
    const mockFacturasList = [mockFactura];

    beforeEach(() => {
      // Configurar cadena de métodos de Mongoose
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockFacturasList),
      };

      mockFacturaModel.find = jest.fn().mockReturnValue(mockQuery);
      mockFacturaModel.countDocuments = jest.fn().mockResolvedValue(1);
    });

    it('debería listar facturas con paginación por defecto', async () => {
      // Arrange
      const queryDto: ListarFacturasQueryDto = {};

      // Act
      const result = await service.listarFacturas(queryDto);

      // Assert
      expect(result).toEqual({
        facturas: mockFacturasList,
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
      });

      expect(mockFacturaModel.find).toHaveBeenCalledWith({});
      expect(mockFacturaModel.countDocuments).toHaveBeenCalledWith({});
    });

    it('debería filtrar por cliente_id cuando se proporciona', async () => {
      // Arrange
      const queryDto: ListarFacturasQueryDto = {
        cliente_id: 123,
        page: 1,
        limit: 5
      };

      // Act
      await service.listarFacturas(queryDto);

      // Assert
      expect(mockFacturaModel.find).toHaveBeenCalledWith({ cliente_id: 123 });
      expect(mockFacturaModel.countDocuments).toHaveBeenCalledWith({ cliente_id: 123 });
    });

    it('debería filtrar por numero_factura con regex cuando se proporciona', async () => {
      // Arrange
      const queryDto: ListarFacturasQueryDto = {
        numero_factura: 'FAC-001'
      };

      // Act
      await service.listarFacturas(queryDto);

      // Assert
      expect(mockFacturaModel.find).toHaveBeenCalledWith({
        numero_factura: { $regex: 'FAC-001', $options: 'i' }
      });
    });

    it('debería calcular correctamente la metadata de paginación', async () => {
      // Arrange
      mockFacturaModel.countDocuments = jest.fn().mockResolvedValue(25);
      const queryDto: ListarFacturasQueryDto = {
        page: 2,
        limit: 10
      };

      // Act
      const result = await service.listarFacturas(queryDto);

      // Assert
      expect(result.metadata).toEqual({
        currentPage: 2,
        itemsPerPage: 10,
        totalItems: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
        nextPage: 3,
        previousPage: 1
      });
    });

    it('debería manejar errores en el listado', async () => {
      // Arrange
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      mockFacturaModel.find = jest.fn().mockReturnValue(mockQuery);

      // Act & Assert
      await expect(service.listarFacturas({}))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('métodos privados', () => {
    it('debería validar factura única correctamente', async () => {
      // Arrange
      mockFacturaModel.exists = jest.fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      // Act & Assert
      await expect(service['validarFacturaUnica'](1, 'FAC-001'))
        .resolves
        .toBeUndefined();
    });

    it('debería preparar datos de factura correctamente', () => {
      // Arrange
      const data = {
        id: 1,
        fecha_emision: '2025-10-24T10:00:00.000Z',
        total: 100
      };

      // Act
      const result = service['prepararDatosFactura'](data);

      // Assert
      expect(result).toEqual({
        ...data,
        fecha_emision: new Date(data.fecha_emision)
      });
    });

    it('debería construir respuesta de éxito correctamente', () => {
      // Arrange
      const mockFactura = { _id: '507f1f77bcf86cd799439011' } as FacturaDocument;
      const numeroFactura = 'FAC-001';

      // Act
      const result = service['buildSuccessResponse'](mockFactura, numeroFactura);

      // Assert
      expect(result).toEqual({
        status: 'success',
        message: 'Factura registrada exitosamente en el sistema',
        data: {
          factura_id: '507f1f77bcf86cd799439011',
          numero_factura: numeroFactura,
          created_at: expect.any(String)
        }
      });
    });
  });
});