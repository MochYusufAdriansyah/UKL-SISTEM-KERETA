import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePetugasDto {
  @ApiProperty({ example: 'Siti Aminah' })
  @IsString()
  @IsNotEmpty()
  nama_petugas!: string;

  @ApiProperty({ example: 'Jl. Sudirman No. 10, Jakarta' })
  @IsString()
  @IsNotEmpty()
  alamat!: string;

  @ApiProperty({ example: '081298765432' })
  @IsString()
  @IsNotEmpty()
  telp!: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
}
