import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Job } from 'bull';
import { SchedulerTask, TaskStatus } from './entities/scheduler-task.entity';

export interface TaskJobData {
  taskId: number;
  task: string;
  instruction?: string;
  parameters?: Record<string, any>;
  tools?: string[];
  productId?: string;
  llmPrompt?: string;
  calculationData?: Record<string, number>;
  comment: string;
}

@Processor('scheduler-tasks')
@Injectable()
export class TaskProcessor {
  private readonly logger = new Logger(TaskProcessor.name);

  constructor(
    @InjectRepository(SchedulerTask)
    private schedulerTaskRepository: Repository<SchedulerTask>,
  ) {}

  @Process({
    name: 'process-task',
    concurrency: 3, // 3 workers processing tasks in parallel
  })
  async processTask(job: Job<TaskJobData>) {
    const { taskId, task, instruction, parameters, tools, productId, llmPrompt, calculationData, comment } = job.data;
    
    this.logger.log(`Worker ${job.id} starting to process task ${taskId}: ${task}`);
    
    try {
      // Simulate task processing with 5 second delay
      this.logger.log(`Worker ${job.id} executing task ${taskId} - waiting 5 seconds...`);
      await this.delay(5000);
      
      // Update task status to DONE in database
      const result = await this.schedulerTaskRepository.update(
        { taskId },
        { status: TaskStatus.DONE }
      );
      
      if (result.affected === 0) {
        throw new Error(`Task ${taskId} not found in database`);
      }
      
      this.logger.log(`Worker ${job.id} successfully completed task ${taskId}: ${task}`);
      
      // Log task details
      this.logger.log(`Task details - ID: ${taskId}, Type: ${task}, Product: ${productId || 'N/A'}, Tools: ${tools?.join(', ') || 'N/A'}`);
      
      return {
        taskId,
        status: 'completed',
        processedAt: new Date(),
        workerId: job.id
      };
      
    } catch (error) {
      this.logger.error(`Worker ${job.id} failed to process task ${taskId}: ${error.message}`);
      
      // Update task status to ERROR in database
      await this.schedulerTaskRepository.update(
        { taskId },
        { status: TaskStatus.ERROR }
      );
      
      throw error;
    }
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
