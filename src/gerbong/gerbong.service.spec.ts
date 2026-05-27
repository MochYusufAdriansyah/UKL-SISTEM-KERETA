import { Test, TestingModule } from '@nestjs/testing';
import { GerbongService } from './gerbong.service';

describe('GerbongService', () => {
  let service: GerbongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GerbongService],
    }).compile();

    service = module.get<GerbongService>(GerbongService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
