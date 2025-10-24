import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { getCorsConfig } from './config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS basada en ambiente
  const corsConfig = getCorsConfig();
  app.enableCors(corsConfig);
  
  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
}
bootstrap();
