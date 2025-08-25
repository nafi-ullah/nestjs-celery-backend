import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import type { CreateHelloDto } from './dto/create-hellobuddy.dto';

@Injectable()
export class HellobuddyService {
  private readonly logger = new Logger(HellobuddyService.name);

  constructor(
    @InjectQueue('hellobuddy-queue') private readonly queue: Queue,
  ) {}

  async create(dto: CreateHelloDto) {
    // Immediate response
    const response = {
      message: 'Request received successfully!',
      data: dto,
      timestamp: new Date().toISOString(),
      backgroundTasksStarted: true,
    };

    // Start 5 background processes
    this.startBackgroundProcesses(dto);

    return response;
  }

  private async startBackgroundProcesses(dto: CreateHelloDto) {
    this.logger.log('Starting 5 background processes...');
    
    for (let i = 1; i <= 5; i++) {
      await this.queue.add('background-task', {
        dto,
        processId: i,
      }, {
        delay: 0, // No delay, start immediately
        attempts: 3, // Retry up to 3 times if failed
      });
    }
    
    this.logger.log('All 5 background processes queued successfully');
  }
}