import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDetailPembelianDto } from './create-detail-pembelian.dto';

export class CreateTicketDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  jadwalId!: number;

  @ApiProperty({
    type: [CreateDetailPembelianDto],
    example: [
      {
        NIK: '3276010101010001',
        nama_penumpang: 'Budi Santoso',
        kursiId: 12,
      },
      {
        NIK: '3276010101010002',
        nama_penumpang: 'Siti Aminah',
        kursiId: 13,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDetailPembelianDto)
  penumpang!: CreateDetailPembelianDto[];
}
