import { Module } from '@nestjs/common';
import { GerbongService } from './gerbong.service';
import { GerbongController } from './gerbong.controller';

@Module({
  controllers: [GerbongController],
  providers: [GerbongService],
})
export class GerbongModule {}
