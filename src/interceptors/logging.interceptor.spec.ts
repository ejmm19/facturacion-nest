import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('debería loggear el inicio y fin de una request', (done) => {
    // Arrange
    const mockRequest = {
      method: 'GET',
      url: '/facturas'
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest
      })
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of('test response')
    } as CallHandler;

    const logSpy = jest.spyOn(interceptor['logger'], 'log');

    // Act
    const result$ = interceptor.intercept(mockContext, mockCallHandler);

    // Assert
    result$.subscribe({
      complete: () => {
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenNthCalledWith(1, '[GET] /facturas - Iniciado');
        expect(logSpy).toHaveBeenNthCalledWith(2, expect.stringMatching(/\[GET\] \/facturas - Completado en \d+ms/));
        done();
      }
    });
  });

  it('debería medir el tiempo de respuesta', (done) => {
    // Arrange
    const mockRequest = {
      method: 'POST',
      url: '/facturas/recibir'
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest
      })
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of('test response').pipe(delay(10))
    } as CallHandler;

    const logSpy = jest.spyOn(interceptor['logger'], 'log');

    // Act
    const result$ = interceptor.intercept(mockContext, mockCallHandler);

    // Assert
    result$.subscribe({
      complete: () => {
        const completedLog = logSpy.mock.calls.find(call => 
          call[0].includes('Completado')
        );
        expect(completedLog).toBeDefined();
        if (completedLog) {
          expect(completedLog[0]).toMatch(/\d+ms/);
        }
        done();
      }
    });
  });
});