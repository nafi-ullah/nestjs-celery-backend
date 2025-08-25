import { Test, TestingModule } from '@nestjs/testing';
import { HellobuddyController } from './hellobuddy.controller';

describe('HellobuddyController', () => {
  let controller: HellobuddyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HellobuddyController],
    }).compile();

    controller = module.get<HellobuddyController>(HellobuddyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
