import { Test, TestingModule } from '@nestjs/testing';
import { KeretaService } from './kereta.service';

describe('KeretaService', () => {
  let service: KeretaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeretaService],
    }).compile();

    service = module.get<KeretaService>(KeretaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
