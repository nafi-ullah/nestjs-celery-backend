import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { CronService } from './cron.service';
import { SchedulerTask } from './entities/scheduler-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchedulerTask])],
  controllers: [SchedulerController],
  providers: [SchedulerService, CronService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
