import { Module } from '@nestjs/common';
import { KeretaService } from './kereta.service';
import { KeretaController } from './kereta.controller';

@Module({
  controllers: [KeretaController],
  providers: [KeretaService],
})
export class KeretaModule {}
