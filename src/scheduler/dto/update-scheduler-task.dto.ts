import { PartialType } from '@nestjs/mapped-types';
import { CreateSchedulerTaskDto } from './create-scheduler-task.dto';

export class UpdateSchedulerTaskDto extends PartialType(CreateSchedulerTaskDto) {}
