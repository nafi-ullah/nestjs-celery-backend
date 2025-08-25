import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import type { CreateHelloDto } from './dto/create-hellobuddy.dto';

@Processor('hellobuddy-queue')
export class HellobuddyProcessor {
  private readonly logger = new Logger(HellobuddyProcessor.name);

  @Process('background-task')
  async handleBackgroundTask(job: Job<{ dto: CreateHelloDto; processId: number }>) {
    const { dto, processId } = job.data;
    
    this.logger.log(`Starting process ${processId} with data:`, dto);
    
    // Simulate 10-second process
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    this.logger.log(`Completed process ${processId}`);
    
    return { processId, completed: true, data: dto };
  }
}