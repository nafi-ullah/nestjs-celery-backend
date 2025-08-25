import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { SchedulerTask, TaskStatus } from './entities/scheduler-task.entity';
import { CreateSchedulerTaskDto } from './dto/create-scheduler-task.dto';
import { UpdateSchedulerTaskDto } from './dto/update-scheduler-task.dto';
import { CreateMultipleSchedulerTasksDto } from './dto/create-multiple-scheduler-tasks.dto';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(SchedulerTask)
    private schedulerTaskRepository: Repository<SchedulerTask>,
  ) {}

  async create(createSchedulerTaskDto: CreateSchedulerTaskDto): Promise<SchedulerTask> {
    const schedulerTask = this.schedulerTaskRepository.create({
      ...createSchedulerTaskDto,
      scheduleTime: new Date(createSchedulerTaskDto.scheduleTime),
    });
    return this.schedulerTaskRepository.save(schedulerTask);
  }

  async createMultiple(createMultipleDto: CreateMultipleSchedulerTasksDto): Promise<SchedulerTask[]> {
    const schedulerTasks = createMultipleDto.tasks.map(taskDto => 
      this.schedulerTaskRepository.create({
        ...taskDto,
        scheduleTime: new Date(taskDto.scheduleTime),
      })
    );
    return this.schedulerTaskRepository.save(schedulerTasks);
  }

  async findAll(): Promise<SchedulerTask[]> {
    return this.schedulerTaskRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: TaskStatus): Promise<SchedulerTask[]> {
    return this.schedulerTaskRepository.find({
      where: { status },
      order: { scheduleTime: 'ASC' },
    });
  }

  async findPendingTasksDue(): Promise<SchedulerTask[]> {
    const currentTime = new Date();
    return this.schedulerTaskRepository.find({
      where: {
        status: TaskStatus.PENDING,
        scheduleTime: LessThanOrEqual(currentTime)
      },
      order: { scheduleTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<SchedulerTask> {
    const schedulerTask = await this.schedulerTaskRepository.findOne({
      where: { taskId: id },
    });
    
    if (!schedulerTask) {
      throw new NotFoundException(`Scheduler task with ID ${id} not found`);
    }
    
    return schedulerTask;
  }

  async update(id: number, updateSchedulerTaskDto: UpdateSchedulerTaskDto): Promise<SchedulerTask> {
    const schedulerTask = await this.findOne(id);
    
    const updateData: any = { ...updateSchedulerTaskDto };
    if (updateSchedulerTaskDto.scheduleTime) {
      updateData.scheduleTime = new Date(updateSchedulerTaskDto.scheduleTime);
    }
    
    Object.assign(schedulerTask, updateData);
    return this.schedulerTaskRepository.save(schedulerTask);
  }

  async updateStatus(id: number, status: TaskStatus): Promise<SchedulerTask> {
    const schedulerTask = await this.findOne(id);
    schedulerTask.status = status;
    return this.schedulerTaskRepository.save(schedulerTask);
  }

  async bulkUpdateStatus(taskIds: number[], status: TaskStatus): Promise<void> {
    await this.schedulerTaskRepository.update(taskIds, { status });
  }

  async remove(id: number): Promise<void> {
    const schedulerTask = await this.findOne(id);
    await this.schedulerTaskRepository.remove(schedulerTask);
  }

  async getTaskStats(): Promise<{ pending: number; done: number; error: number; total: number }> {
    const [pending, done, error, total] = await Promise.all([
      this.schedulerTaskRepository.count({ where: { status: TaskStatus.PENDING } }),
      this.schedulerTaskRepository.count({ where: { status: TaskStatus.DONE } }),
      this.schedulerTaskRepository.count({ where: { status: TaskStatus.ERROR } }),
      this.schedulerTaskRepository.count(),
    ]);

    return { pending, done, error, total };
  }
}
