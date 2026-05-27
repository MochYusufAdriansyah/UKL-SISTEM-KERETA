import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGerbongDto {
  @ApiProperty({ example: 'Gerbong A' })
  @IsString()
  @IsNotEmpty()
  nama_gerbong!: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @IsNotEmpty()
  kuota!: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  keretaId!: number;
}
