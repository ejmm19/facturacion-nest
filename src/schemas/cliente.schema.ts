import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // No generar _id para esquemas anidados
export class Cliente {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  direccion: string;

  @Prop({ required: true })
  identificacion: string;

  @Prop({ required: true })
  created_at: string;

  @Prop({ required: true })
  updated_at: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);