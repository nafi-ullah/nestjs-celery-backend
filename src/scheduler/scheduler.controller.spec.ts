import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { TaskStatus } from './entities/scheduler-task.entity';

describe('SchedulerController', () => {
  let controller: SchedulerController;
  let service: SchedulerService;

  const mockSchedulerService = {
    create: jest.fn(),
    createMultiple: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulerController],
      providers: [
        {
          provide: SchedulerService,
          useValue: mockSchedulerService,
        },
      ],
    }).compile();

    controller = module.get<SchedulerController>(SchedulerController);
    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a scheduler task', async () => {
      const createDto = {
        task: 'test-task',
        scheduleTime: '2025-08-26T10:00:00Z',
        comment: 'test comment',
      };

      const expectedResult = {
        taskId: 1,
        ...createDto,
        status: TaskStatus.PENDING,
        createdAt: new Date(),
      };

      mockSchedulerService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of scheduler tasks', async () => {
      const expectedResult = [
        {
          taskId: 1,
          task: 'test-task',
          status: TaskStatus.PENDING,
        },
      ];

      mockSchedulerService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a single scheduler task', async () => {
      const taskId = 1;
      const expectedResult = {
        taskId,
        task: 'test-task',
        status: TaskStatus.PENDING,
      };

      mockSchedulerService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(taskId);

      expect(service.findOne).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(expectedResult);
    });
  });
});
