import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ListarFacturasQueryDto } from './listar-facturas-query.dto';

describe('ListarFacturasQueryDto', () => {
  it('debería validar exitosamente con valores válidos', async () => {
    // Arrange
    const validData = {
      page: 1,
      limit: 10,
      cliente_id: 123,
      numero_factura: 'FAC-001'
    };

    // Act
    const dto = plainToClass(ListarFacturasQueryDto, validData);
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
    expect(dto.cliente_id).toBe(123);
    expect(dto.numero_factura).toBe('FAC-001');
  });

  it('debería usar valores por defecto cuando no se proporcionan', async () => {
    // Arrange
    const emptyData = {};

    // Act
    const dto = plainToClass(ListarFacturasQueryDto, emptyData);
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
  });

  it('debería fallar con página inválida', async () => {
    // Arrange
    const invalidData = { page: 0 };

    // Act
    const dto = plainToClass(ListarFacturasQueryDto, invalidData);
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('page');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('debería fallar con límite mayor al máximo permitido', async () => {
    // Arrange
    const invalidData = { limit: 150 };

    // Act
    const dto = plainToClass(ListarFacturasQueryDto, invalidData);
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('limit');
    expect(errors[0].constraints).toHaveProperty('max');
  });

  it('debería convertir strings a números', async () => {
    // Arrange
    const stringData = {
      page: '2',
      limit: '15',
      cliente_id: '456'
    };

    // Act
    const dto = plainToClass(ListarFacturasQueryDto, stringData);
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(15);
    expect(dto.cliente_id).toBe(456);
    expect(typeof dto.page).toBe('number');
    expect(typeof dto.limit).toBe('number');
    expect(typeof dto.cliente_id).toBe('number');
  });

  it('debería fallar con cliente_id inválido', async () => {
    // Arrange
    const invalidData = { cliente_id: -1 };

    // Act
    const dto = plainToClass(ListarFacturasQueryDto, invalidData);
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('cliente_id');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('debería validar numero_factura como string', async () => {
    // Arrange
    const validData = { numero_factura: 'FAC-123-ABC' };

    // Act
    const dto = plainToClass(ListarFacturasQueryDto, validData);
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
    expect(dto.numero_factura).toBe('FAC-123-ABC');
  });
});