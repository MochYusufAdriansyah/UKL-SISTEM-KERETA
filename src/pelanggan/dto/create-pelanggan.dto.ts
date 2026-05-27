import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePelangganDto {
  @ApiProperty({ example: '3276010101010001' })
  @IsString()
  @IsNotEmpty()
  NIK!: string;

  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  nama_penumpang!: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 1, Bandung' })
  @IsString()
  @IsNotEmpty()
  alamat!: string;

  @ApiProperty({ example: '081234567890' })
  @IsString()
  @IsNotEmpty()
  telp!: string;

  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({
    example: 1,
    description: 'Only required when created by ADMIN',
  })
  @IsNumber()
  userId?: number;
}
