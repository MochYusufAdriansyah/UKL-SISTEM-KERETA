import { Module } from '@nestjs/common';
import { KursiService } from './kursi.service';
import { KursiController } from './kursi.controller';

@Module({
  controllers: [KursiController],
  providers: [KursiService],
})
export class KursiModule {}
