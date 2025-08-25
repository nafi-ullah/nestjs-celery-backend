import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { SchedulerTask } from './entities/scheduler-task.entity';
import { TaskJobData } from './task.processor';

@Injectable()
export class TaskQueueService {
  private readonly logger = new Logger(TaskQueueService.name);

  constructor(
    @InjectQueue('scheduler-tasks') private taskQueue: Queue,
  ) {}

  async addTaskToQueue(task: SchedulerTask): Promise<void> {
    try {
      const jobData: TaskJobData = {
        taskId: task.taskId,
        task: task.task,
        instruction: task.instruction,
        parameters: task.parameters,
        tools: task.tools,
        productId: task.productId,
        llmPrompt: task.llmPrompt,
        calculationData: task.calculationData,
        comment: task.comment,
      };

      const job = await this.taskQueue.add('process-task', jobData, {
        attempts: 3, // Retry failed jobs up to 3 times
        backoff: {
          type: 'exponential',
          delay: 2000, // Start with 2 second delay, then exponential backoff
        },
        removeOnComplete: 10, // Keep only last 10 completed jobs
        removeOnFail: 50, // Keep only last 50 failed jobs
      });

      this.logger.log(`Added task ${task.taskId} to queue with job ID: ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to add task ${task.taskId} to queue: ${error.message}`);
      throw error;
    }
  }

  async addMultipleTasksToQueue(tasks: SchedulerTask[]): Promise<void> {
    try {
      const jobs = tasks.map(task => ({
        name: 'process-task',
        data: {
          taskId: task.taskId,
          task: task.task,
          instruction: task.instruction,
          parameters: task.parameters,
          tools: task.tools,
          productId: task.productId,
          llmPrompt: task.llmPrompt,
          calculationData: task.calculationData,
          comment: task.comment,
        } as TaskJobData,
        opts: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 10,
          removeOnFail: 50,
        }
      }));

      await this.taskQueue.addBulk(jobs);
      this.logger.log(`Added ${tasks.length} tasks to queue in bulk`);
    } catch (error) {
      this.logger.error(`Failed to add ${tasks.length} tasks to queue: ${error.message}`);
      throw error;
    }
  }

  async getQueueInfo() {
    const waiting = await this.taskQueue.getWaiting();
    const active = await this.taskQueue.getActive();
    const completed = await this.taskQueue.getCompleted();
    const failed = await this.taskQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }
}
