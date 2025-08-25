import { IsString, IsOptional, IsEnum, IsDateString, IsObject, IsArray } from 'class-validator';
import { TaskStatus } from '../entities/scheduler-task.entity';

export class CreateSchedulerTaskDto {
  @IsString()
  task: string;

  @IsOptional()
  @IsString()
  instruction?: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  llmPrompt?: string;

  @IsOptional()
  @IsObject()
  calculationData?: Record<string, number>;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsDateString()
  scheduleTime: string;

  @IsString()
  comment: string;
}
