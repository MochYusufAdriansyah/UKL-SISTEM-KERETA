import { Test, TestingModule } from '@nestjs/testing';
import { KeretaController } from './kereta.controller';
import { KeretaService } from './kereta.service';

describe('KeretaController', () => {
  let controller: KeretaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeretaController],
      providers: [KeretaService],
    }).compile();

    controller = module.get<KeretaController>(KeretaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
