import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { FacturasController } from '../src/facturas.controller';
import { FacturasService } from '../src/facturas.service';
import { Factura } from '../src/schemas/factura.schema';

describe('FacturasController (e2e)', () => {
  let app: INestApplication;

  const mockFacturaModel = {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
    countDocuments: jest.fn().mockResolvedValue(0),
    exists: jest.fn().mockResolvedValue(null),
    constructor: jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        _id: 'test-id',
        numero_factura: 'FAC-001'
      })
    }))
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FacturasController],
      providers: [
        FacturasService,
        {
          provide: getModelToken(Factura.name),
          useValue: mockFacturaModel,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/facturas (GET)', () => {
    it('debería retornar lista vacía inicialmente', () => {
      return request.default(app.getHttpServer())
        .get('/facturas')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('facturas');
          expect(res.body).toHaveProperty('metadata');
        });
    });

    it('debería manejar parámetros de paginación', () => {
      return request.default(app.getHttpServer())
        .get('/facturas?page=2&limit=5')
        .expect(200);
    });
  });

  describe('/facturas/recibir (POST)', () => {
    const validFactura = {
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

    it('debería validar datos requeridos', () => {
      const invalidFactura = {
        data: {
          id: 2,
          numero_factura: 'FAC-002'
          // Faltan campos requeridos
        }
      };

      return request.default(app.getHttpServer())
        .post('/facturas/recibir')
        .send(invalidFactura)
        .expect(400);
    });

    it('debería rechazar campos no permitidos', () => {
      const facturaConCamposExtra = {
        ...validFactura,
        campoNoPermitido: 'valor'
      };

      return request.default(app.getHttpServer())
        .post('/facturas/recibir')
        .send(facturaConCamposExtra)
        .expect(400);
    });
  });
});