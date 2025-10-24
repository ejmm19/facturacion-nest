import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Producto, ProductoSchema } from './producto.schema';

@Schema({ _id: false }) // No generar _id para esquemas anidados
export class DetalleFactura {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  producto_id: number;

  @Prop({ type: ProductoSchema, required: true })
  producto: Producto;

  @Prop({ required: true, min: 1 })
  cantidad: number;

  @Prop({ required: true, min: 0 })
  precio_unitario: number;

  @Prop({ required: true, min: 0 })
  subtotal: number;
}

export const DetalleFacturaSchema = SchemaFactory.createForClass(DetalleFactura);