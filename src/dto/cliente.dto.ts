import { IsNotEmpty, IsNumber, IsString, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class ClienteDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  identificacion: string;

  @IsNotEmpty()
  @IsString()
  created_at: string;

  @IsNotEmpty()
  @IsString()
  updated_at: string;
}