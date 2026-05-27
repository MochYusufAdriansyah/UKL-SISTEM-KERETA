import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJadwalDto {
  @ApiProperty({ example: 'Bandung' })
  @IsString()
  @IsNotEmpty()
  asal_keberangkatan!: string;

  @ApiProperty({ example: 'Surabaya' })
  @IsString()
  @IsNotEmpty()
  tujuan_keberangkatan!: string;

  @ApiProperty({ example: '2026-06-10T08:00:00.000Z' })
  @IsDateString()
  tanggal_berangkat!: string;

  @ApiProperty({ example: '2026-06-10T16:00:00.000Z' })
  @IsDateString()
  tanggal_kedatangan!: string;

  @ApiProperty({ example: 350000 })
  @Type(() => Number)
  @IsNumber()
  harga!: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  keretaId!: number;
}
