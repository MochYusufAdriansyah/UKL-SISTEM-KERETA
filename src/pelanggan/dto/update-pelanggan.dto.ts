import { PartialType } from '@nestjs/swagger';
import { CreatePelangganDto } from './create-pelanggan.dto';

export class UpdatePelangganDto extends PartialType(CreatePelangganDto) {}
