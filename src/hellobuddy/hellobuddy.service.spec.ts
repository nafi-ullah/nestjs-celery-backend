import { Test, TestingModule } from '@nestjs/testing';
import { HellobuddyService } from './hellobuddy.service';

describe('HellobuddyService', () => {
  let service: HellobuddyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HellobuddyService],
    }).compile();

    service = module.get<HellobuddyService>(HellobuddyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
