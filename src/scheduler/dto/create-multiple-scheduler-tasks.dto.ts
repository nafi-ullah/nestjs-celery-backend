import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSchedulerTaskDto } from './create-scheduler-task.dto';

export class CreateMultipleSchedulerTasksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSchedulerTaskDto)
  tasks: CreateSchedulerTaskDto[];
}
