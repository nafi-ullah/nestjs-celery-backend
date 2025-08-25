import { IsString, IsOptional, IsEnum, IsDateString, IsObject, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../entities/scheduler-task.entity';

export class CreateSchedulerTaskDto {
  @ApiProperty({
    description: 'Name or type of the task to be executed',
    example: 'process_product_data',
    maxLength: 255
  })
  @IsString()
  task: string;

  @ApiPropertyOptional({
    description: 'Detailed instructions for task execution',
    example: 'Process the product data and generate insights'
  })
  @IsOptional()
  @IsString()
  instruction?: string;

  @ApiPropertyOptional({
    description: 'Key-value pairs of parameters for the task',
    example: { batchSize: 100, includeAnalytics: true }
  })
  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Array of tool names required for the task',
    example: ['calculator', 'data-processor', 'analytics'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tools?: string[];

  @ApiPropertyOptional({
    description: 'Associated product identifier',
    example: 'PROD-12345'
  })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Prompt for LLM if AI processing is required',
    example: 'Analyze the product data and provide insights'
  })
  @IsOptional()
  @IsString()
  llmPrompt?: string;

  @ApiPropertyOptional({
    description: 'Numeric data for calculations (key-value pairs)',
    example: { revenue: 50000, cost: 30000, margin: 20000 }
  })
  @IsOptional()
  @IsObject()
  calculationData?: Record<string, number>;

  @ApiPropertyOptional({
    description: 'Current status of the task',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({
    description: 'When the task should be executed',
    example: '2025-08-26T10:30:00Z',
    format: 'date-time'
  })
  @IsDateString()
  scheduleTime: string;

  @ApiProperty({
    description: 'Additional notes or comments about the task',
    example: 'Monthly product analysis task'
  })
  @IsString()
  comment: string;
}
