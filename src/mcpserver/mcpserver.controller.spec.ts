import { Test, TestingModule } from '@nestjs/testing';
import { McpserverController } from './mcpserver.controller';

describe('McpserverController', () => {
  let controller: McpserverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McpserverController],
    }).compile();

    controller = module.get<McpserverController>(McpserverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
