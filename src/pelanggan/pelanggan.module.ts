import { Module } from '@nestjs/common';
import { PelangganService } from './pelanggan.service';
import { PelangganController } from './pelanggan.controller';

@Module({
  controllers: [PelangganController],
  providers: [PelangganService],
})
export class PelangganModule {}
