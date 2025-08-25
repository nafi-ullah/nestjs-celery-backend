import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'pending',
  ERROR = 'error',
  DONE = 'done',
}

@Entity('schedulertasks')
export class SchedulerTask {
  @ApiProperty({
    description: 'Unique identifier for the scheduler task',
    example: 1,
    readOnly: true
  })
  @PrimaryGeneratedColumn()
  taskId: number;

  @ApiProperty({
    description: 'Name or type of the task to be executed',
    example: 'process_product_data',
    maxLength: 255
  })
  @Column({ type: 'varchar', length: 255 })
  task: string;

  @ApiProperty({
    description: 'Detailed instructions for task execution',
    example: 'Process the product data and generate insights',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  instruction?: string;

  @ApiProperty({
    description: 'Key-value pairs of parameters for the task',
    example: { batchSize: 100, includeAnalytics: true },
    required: false
  })
  @Column({ type: 'json', nullable: true })
  parameters?: Record<string, any>;

  @ApiProperty({
    description: 'Array of tool names required for the task',
    example: ['calculator', 'data-processor', 'analytics'],
    required: false,
    type: [String]
  })
  @Column({ type: 'json', nullable: true })
  tools?: string[];

  @ApiProperty({
    description: 'Associated product identifier',
    example: 'PROD-12345',
    required: false,
    maxLength: 255
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  productId?: string;

  @ApiProperty({
    description: 'Prompt for LLM if AI processing is required',
    example: 'Analyze the product data and provide insights',
    required: false
  })
  @Column({ type: 'text', nullable: true })
  llmPrompt?: string;

  @ApiProperty({
    description: 'Numeric data for calculations (key-value pairs)',
    example: { revenue: 50000, cost: 30000, margin: 20000 },
    required: false
  })
  @Column({ type: 'json', nullable: true })
  calculationData?: Record<string, number>;

  @ApiProperty({
    description: 'Current status of the task',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Timestamp when the task was created',
    example: '2025-08-25T12:00:00.000Z',
    readOnly: true
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'When the task should be executed',
    example: '2025-08-26T10:30:00.000Z',
    type: 'string',
    format: 'date-time'
  })
  @Column({ type: 'timestamp' })
  scheduleTime: Date;

  @ApiProperty({
    description: 'Additional notes or comments about the task',
    example: 'Monthly product analysis task'
  })
  @Column({ type: 'text' })
  comment: string;
}
