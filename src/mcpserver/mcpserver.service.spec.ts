import { Test, TestingModule } from '@nestjs/testing';
import { McpserverService } from './mcpserver.service';

describe('McpserverService', () => {
  let service: McpserverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McpserverService],
    }).compile();

    service = module.get<McpserverService>(McpserverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
