import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { CronService } from './cron.service';
import { TaskQueueService } from './task-queue.service';
import { TaskProcessor } from './task.processor';
import { SchedulerTask } from './entities/scheduler-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchedulerTask]),
    BullModule.registerQueue({
      name: 'scheduler-tasks',
      redis: {
        host: '127.0.0.1',
        port: 6379,
        password: 'redispass',
      },
    }),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, CronService, TaskQueueService, TaskProcessor],
  exports: [SchedulerService, TaskQueueService],
})
export class SchedulerModule {}
