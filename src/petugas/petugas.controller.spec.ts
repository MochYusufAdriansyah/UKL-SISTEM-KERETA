import { Test, TestingModule } from '@nestjs/testing';
import { PetugasController } from './petugas.controller';
import { PetugasService } from './petugas.service';

describe('PetugasController', () => {
  let controller: PetugasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetugasController],
      providers: [PetugasService],
    }).compile();

    controller = module.get<PetugasController>(PetugasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
