import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKursiDto {
  @ApiProperty({ example: 'A1' })
  @IsString()
  @IsNotEmpty()
  no_kursi!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  gerbongId!: number;
}
