import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { Factura, FacturaSchema } from './schemas/factura.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/facturacion?authSource=admin'
    ),
    MongooseModule.forFeature([
      { name: Factura.name, schema: FacturaSchema }
    ]),
  ],
  controllers: [AppController, FacturasController],
  providers: [FacturasService],
})
export class AppModule {}
