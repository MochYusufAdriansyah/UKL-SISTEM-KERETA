import { Test, TestingModule } from '@nestjs/testing';
import { GerbongController } from './gerbong.controller';
import { GerbongService } from './gerbong.service';

describe('GerbongController', () => {
  let controller: GerbongController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GerbongController],
      providers: [GerbongService],
    }).compile();

    controller = module.get<GerbongController>(GerbongController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
