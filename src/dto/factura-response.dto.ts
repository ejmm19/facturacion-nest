import { Exclude, Transform } from 'class-transformer';

export class FacturaResponseDto {
  _id: string;
  id: number;
  numero_factura: string;
  fecha_emision: Date;
  total: number;
  cliente_id: number;
  cliente: any;
  consecutivo_id: number;
  detalles: any[];
  created_at: string;
  updated_at: string;
  createdAt: Date;
  updatedAt: Date;

  // Excluir campos no deseados de la respuesta
  @Exclude()
  buffer?: any;

  @Exclude()
  __v?: number;

  constructor(partial: Partial<FacturaResponseDto>) {
    Object.assign(this, partial);
  }
}