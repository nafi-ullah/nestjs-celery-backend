import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSchedulerTaskDto } from './create-scheduler-task.dto';

export class CreateMultipleSchedulerTasksDto {
  @ApiProperty({
    description: 'Array of scheduler tasks to be created',
    type: [CreateSchedulerTaskDto],
    example: [
      {
        task: 'backup_database',
        instruction: 'Create a backup of the main database',
        scheduleTime: '2025-08-26T02:00:00Z',
        comment: 'Daily database backup'
      },
      {
        task: 'generate_reports',
        instruction: 'Generate daily sales reports',
        parameters: { reportType: 'sales', period: 'daily' },
        scheduleTime: '2025-08-26T06:00:00Z',
        comment: 'Daily sales report generation'
      }
    ]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSchedulerTaskDto)
  tasks: CreateSchedulerTaskDto[];
}
