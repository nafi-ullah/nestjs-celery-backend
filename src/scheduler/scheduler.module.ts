import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { SchedulerTask } from './entities/scheduler-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SchedulerTask])],
  controllers: [SchedulerController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
