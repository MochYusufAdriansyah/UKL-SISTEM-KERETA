import { PartialType } from '@nestjs/swagger';
import { CreateKeretaDto } from './create-kereta.dto';

export class UpdateKeretaDto extends PartialType(CreateKeretaDto) {}
