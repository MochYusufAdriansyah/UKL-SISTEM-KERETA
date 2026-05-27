import { PartialType } from '@nestjs/swagger';
import { CreateGerbongDto } from './create-gerbong.dto';

export class UpdateGerbongDto extends PartialType(CreateGerbongDto) {}
