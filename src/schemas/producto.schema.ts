import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) 
export class Producto {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  codigo: string;

  @Prop({ required: true, min: 0 })
  precio_unitario: number;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  created_at: string;

  @Prop({ required: true })
  updated_at: string;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);