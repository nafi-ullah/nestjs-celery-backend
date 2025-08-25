import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SchedulerTask, TaskStatus } from './entities/scheduler-task.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('SchedulerService', () => {
  let service: SchedulerService;
  let repository: Repository<SchedulerTask>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: getRepositoryToken(SchedulerTask),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
    repository = module.get<Repository<SchedulerTask>>(getRepositoryToken(SchedulerTask));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a scheduler task', async () => {
      const createDto = {
        task: 'test-task',
        scheduleTime: '2025-08-26T10:00:00Z',
        comment: 'test comment',
      };

      const expectedTask = {
        taskId: 1,
        ...createDto,
        scheduleTime: new Date(createDto.scheduleTime),
        status: TaskStatus.PENDING,
        createdAt: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedTask);
      mockRepository.save.mockResolvedValue(expectedTask);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        scheduleTime: new Date(createDto.scheduleTime),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedTask);
      expect(result).toEqual(expectedTask);
    });
  });

  describe('findOne', () => {
    it('should return a scheduler task when found', async () => {
      const taskId = 1;
      const expectedTask = {
        taskId,
        task: 'test-task',
        status: TaskStatus.PENDING,
      };

      mockRepository.findOne.mockResolvedValue(expectedTask);

      const result = await service.findOne(taskId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { taskId },
      });
      expect(result).toEqual(expectedTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      const taskId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(taskId)).rejects.toThrow(
        new NotFoundException(`Scheduler task with ID ${taskId} not found`)
      );
    });
  });
});
