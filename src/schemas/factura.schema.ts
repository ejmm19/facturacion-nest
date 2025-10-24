import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Cliente, ClienteSchema } from './cliente.schema';
import { DetalleFactura, DetalleFacturaSchema } from './detalle-factura.schema';

export type FacturaDocument = Factura & Document;

@Schema({ timestamps: true })
export class Factura {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  numero_factura: string;

  @Prop({ required: true })
  fecha_emision: Date;

  @Prop({ required: true, min: 0 })
  total: number;

  @Prop({ required: true })
  cliente_id: number;

  @Prop({ type: ClienteSchema, required: true })
  cliente: Cliente;

  @Prop({ required: true })
  consecutivo_id: number;

  @Prop({ type: [DetalleFacturaSchema], required: true })
  detalles: DetalleFactura[];

  @Prop({ required: true })
  created_at: string;

  @Prop({ required: true })
  updated_at: string;
}

export const FacturaSchema = SchemaFactory.createForClass(Factura);