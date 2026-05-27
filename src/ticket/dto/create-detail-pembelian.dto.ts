import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDetailPembelianDto {
  @ApiProperty({ example: '3276010101010001' })
  @IsString()
  @IsNotEmpty()
  NIK!: string;

  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  @IsNotEmpty()
  nama_penumpang!: string;

  @ApiProperty({ example: 12 })
  @Type(() => Number)
  @IsNumber()
  kursiId!: number;
}
