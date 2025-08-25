import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum TaskStatus {
  PENDING = 'pending',
  ERROR = 'error',
  DONE = 'done',
}

@Entity('schedulertasks')
export class SchedulerTask {
  @PrimaryGeneratedColumn()
  taskId: number;

  @Column({ type: 'varchar', length: 255 })
  task: string;

  @Column({ type: 'text', nullable: true })
  instruction?: string;

  @Column({ type: 'json', nullable: true })
  parameters?: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  tools?: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  productId?: string;

  @Column({ type: 'text', nullable: true })
  llmPrompt?: string;

  @Column({ type: 'json', nullable: true })
  calculationData?: Record<string, number>;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  scheduleTime: Date;

  @Column({ type: 'text' })
  comment: string;
}
