import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKeretaDto {
  @ApiProperty({ example: 'Argo Bromo Anggrek' })
  @IsString()
  @IsNotEmpty()
  nama_kereta!: string;

  @ApiProperty({ example: 'Kereta eksekutif Surabaya - Jakarta' })
  @IsString()
  @IsNotEmpty()
  deskripsi!: string;

  @ApiProperty({ example: 'EKSEKUTIF' })
  @IsString()
  @IsNotEmpty()
  kelas!: string;
}
