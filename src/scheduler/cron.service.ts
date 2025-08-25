import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { SchedulerTask, TaskStatus } from './entities/scheduler-task.entity';
import { TaskQueueService } from './task-queue.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(SchedulerTask)
    private schedulerTaskRepository: Repository<SchedulerTask>,
    private taskQueueService: TaskQueueService,
  ) {}

  @Cron('0 */3 * * * *', { name: 'addRandomTasks' }) // Every 3 minutes
  async addRandomTasks() {
    this.logger.log('Starting cron job to add 6 random tasks...');
    
    try {
      const currentTime = new Date();
      const tasks: Partial<SchedulerTask>[] = [];

      // Task templates for random generation
      const taskTemplates = [
        {
          task: 'process_product_data',
          instruction: 'Process the product data and generate insights',
          comment: 'Automated product data processing task',
          tools: ['calculator', 'data-processor'],
          parameters: { batchSize: 100, includeAnalytics: true }
        },
        {
          task: 'analyze_sales_trends',
          instruction: 'Analyze recent sales trends and patterns',
          comment: 'Sales trend analysis task',
          tools: ['analytics', 'data-processor'],
          parameters: { period: '7days', includeForecasting: true }
        },
        {
          task: 'update_inventory',
          instruction: 'Update inventory levels and stock status',
          comment: 'Inventory update task',
          tools: ['inventory-manager'],
          parameters: { checkThresholds: true, autoReorder: false }
        },
        {
          task: 'generate_reports',
          instruction: 'Generate daily operational reports',
          comment: 'Daily report generation task',
          tools: ['report-generator', 'analytics'],
          parameters: { reportType: 'daily', includeCharts: true }
        },
        {
          task: 'data_cleanup',
          instruction: 'Clean up outdated and duplicate data entries',
          comment: 'Data cleanup maintenance task',
          tools: ['data-processor'],
          parameters: { removeOlderThan: '30days', checkDuplicates: true }
        },
        {
          task: 'backup_database',
          instruction: 'Create backup of critical database tables',
          comment: 'Database backup task',
          tools: ['backup-manager'],
          parameters: { compression: true, includeIndexes: true }
        },
        {
          task: 'send_notifications',
          instruction: 'Send pending notifications to users',
          comment: 'Notification delivery task',
          tools: ['notification-sender'],
          parameters: { batchSize: 50, retryFailures: true }
        },
        {
          task: 'calculate_metrics',
          instruction: 'Calculate business metrics and KPIs',
          comment: 'Business metrics calculation task',
          tools: ['calculator', 'analytics'],
          calculationData: { revenue: 0, expenses: 0, profit: 0 }
        }
      ];

      // Generate 6 random tasks with sequential schedule times
      for (let i = 0; i < 6; i++) {
        const randomTemplate = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
        const scheduleTime = new Date(currentTime.getTime() + (i + 1) * 60 * 1000); // Add minutes sequentially
        
        // Add some randomization to the template
        const randomProductId = Math.random() > 0.5 ? `PROD-${Math.floor(Math.random() * 10000)}` : undefined;
        const randomLlmPrompt = Math.random() > 0.7 ? `Analyze and provide insights for ${randomTemplate.task}` : undefined;

        const task: Partial<SchedulerTask> = {
          ...randomTemplate,
          productId: randomProductId,
          llmPrompt: randomLlmPrompt,
          scheduleTime: scheduleTime,
          status: TaskStatus.PENDING,
          createdAt: currentTime
        };

        tasks.push(task);
      }

      // Save all tasks to database
      const createdTasks = await this.schedulerTaskRepository.save(tasks);
      
      this.logger.log(`Successfully created ${createdTasks.length} random tasks scheduled from ${new Date(currentTime.getTime() + 60 * 1000).toISOString()} to ${new Date(currentTime.getTime() + 6 * 60 * 1000).toISOString()}`);
      
    } catch (error) {
      this.logger.error('Error creating random tasks:', error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE, { name: 'processPendingTasks' }) // Every minute
  async processPendingTasks() {
    this.logger.log('Checking for pending tasks to process...');
    
    try {
      const currentTime = new Date();
      
      // Find all pending tasks whose schedule time has passed or is now
      const pendingTasks = await this.schedulerTaskRepository.find({
        where: {
          status: TaskStatus.PENDING,
          scheduleTime: LessThanOrEqual(currentTime)
        }
      });

      if (pendingTasks.length === 0) {
        this.logger.log('No pending tasks found to process');
        return;
      }

      this.logger.log(`Found ${pendingTasks.length} pending tasks to send to queue`);

      // Send all pending tasks to the queue for processing by workers
      await this.taskQueueService.addMultipleTasksToQueue(pendingTasks);
      
      this.logger.log(`Successfully sent ${pendingTasks.length} pending tasks to queue for processing`);
      
      // Log details of queued tasks
      pendingTasks.forEach(task => {
        this.logger.log(`Queued task: ${task.task} (ID: ${task.taskId}) scheduled for ${task.scheduleTime.toISOString()}`);
      });
      
      // Get and log queue status
      const queueInfo = await this.taskQueueService.getQueueInfo();
      this.logger.log(`Queue status - Waiting: ${queueInfo.waiting}, Active: ${queueInfo.active}, Completed: ${queueInfo.completed}, Failed: ${queueInfo.failed}`);
      
    } catch (error) {
      this.logger.error('Error processing pending tasks:', error);
    }
  }

  @Cron('0 0 * * *', { name: 'cleanupOldTasks' }) // Daily at midnight
  async cleanupOldTasks() {
    this.logger.log('Starting cleanup of old completed tasks...');
    
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Delete tasks older than 30 days that are completed
      const result = await this.schedulerTaskRepository
        .createQueryBuilder()
        .delete()
        .from(SchedulerTask)
        .where('status = :status AND createdAt < :date', {
          status: TaskStatus.DONE,
          date: thirtyDaysAgo
        })
        .execute();
      
      this.logger.log(`Cleaned up ${result.affected || 0} old completed tasks`);
      
    } catch (error) {
      this.logger.error('Error cleaning up old tasks:', error);
    }
  }
}
