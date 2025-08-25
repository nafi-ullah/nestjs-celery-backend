import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiQuery
} from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';
import { TaskQueueService } from './task-queue.service';
import { CreateSchedulerTaskDto } from './dto/create-scheduler-task.dto';
import { UpdateSchedulerTaskDto } from './dto/update-scheduler-task.dto';
import { CreateMultipleSchedulerTasksDto } from './dto/create-multiple-scheduler-tasks.dto';
import { SchedulerTask, TaskStatus } from './entities/scheduler-task.entity';

@ApiTags('scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly taskQueueService: TaskQueueService,
  ) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new scheduler task',
    description: 'Creates a single scheduler task with the provided details'
  })
  @ApiCreatedResponse({
    description: 'The scheduler task has been successfully created.',
    type: SchedulerTask,
  })
  @ApiBody({ type: CreateSchedulerTaskDto })
  create(@Body() createSchedulerTaskDto: CreateSchedulerTaskDto) {
    return this.schedulerService.create(createSchedulerTaskDto);
  }

  @Post('multiple')
  @ApiOperation({ 
    summary: 'Create multiple scheduler tasks',
    description: 'Creates multiple scheduler tasks from an array of task definitions'
  })
  @ApiCreatedResponse({
    description: 'The scheduler tasks have been successfully created.',
    type: [SchedulerTask],
  })
  @ApiBody({ type: CreateMultipleSchedulerTasksDto })
  createMultiple(@Body() createMultipleDto: CreateMultipleSchedulerTasksDto) {
    return this.schedulerService.createMultiple(createMultipleDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all scheduler tasks',
    description: 'Retrieves all scheduler tasks ordered by creation date (newest first)'
  })
  @ApiOkResponse({
    description: 'List of all scheduler tasks.',
    type: [SchedulerTask],
  })
  findAll() {
    return this.schedulerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a scheduler task by ID',
    description: 'Retrieves a specific scheduler task by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the scheduler task',
    example: 1
  })
  @ApiOkResponse({
    description: 'The scheduler task with the specified ID.',
    type: SchedulerTask,
  })
  @ApiNotFoundResponse({
    description: 'Scheduler task with the specified ID was not found.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update a scheduler task',
    description: 'Updates an existing scheduler task with partial data'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the scheduler task to update',
    example: 1
  })
  @ApiOkResponse({
    description: 'The scheduler task has been successfully updated.',
    type: SchedulerTask,
  })
  @ApiNotFoundResponse({
    description: 'Scheduler task with the specified ID was not found.',
  })
  @ApiBody({ type: UpdateSchedulerTaskDto })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSchedulerTaskDto: UpdateSchedulerTaskDto
  ) {
    return this.schedulerService.update(id, updateSchedulerTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete a scheduler task',
    description: 'Permanently deletes a scheduler task by its ID'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the scheduler task to delete',
    example: 1
  })
  @ApiNoContentResponse({
    description: 'The scheduler task has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Scheduler task with the specified ID was not found.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.remove(id);
  }

  @Get('status/:status')
  @ApiOperation({ 
    summary: 'Get tasks by status',
    description: 'Retrieves all scheduler tasks with a specific status'
  })
  @ApiParam({
    name: 'status',
    enum: TaskStatus,
    description: 'The status to filter tasks by',
    example: TaskStatus.PENDING
  })
  @ApiOkResponse({
    description: 'List of scheduler tasks with the specified status.',
    type: [SchedulerTask],
  })
  findByStatus(@Param('status') status: TaskStatus) {
    return this.schedulerService.findByStatus(status);
  }

  @Get('monitoring/pending-due')
  @ApiOperation({ 
    summary: 'Get pending tasks that are due',
    description: 'Retrieves all pending tasks whose schedule time has passed or is now'
  })
  @ApiOkResponse({
    description: 'List of pending tasks that are due for processing.',
    type: [SchedulerTask],
  })
  findPendingTasksDue() {
    return this.schedulerService.findPendingTasksDue();
  }

  @Get('monitoring/stats')
  @ApiOperation({ 
    summary: 'Get task statistics',
    description: 'Retrieves statistics about tasks grouped by status'
  })
  @ApiOkResponse({
    description: 'Task statistics including counts by status.',
    schema: {
      type: 'object',
      properties: {
        pending: { type: 'number', description: 'Number of pending tasks' },
        done: { type: 'number', description: 'Number of completed tasks' },
        error: { type: 'number', description: 'Number of tasks with errors' },
        total: { type: 'number', description: 'Total number of tasks' }
      }
    }
  })
  getTaskStats() {
    return this.schedulerService.getTaskStats();
  }

  @Patch('bulk-update-status')
  @ApiOperation({ 
    summary: 'Bulk update task status',
    description: 'Updates the status of multiple tasks at once'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        taskIds: { 
          type: 'array', 
          items: { type: 'number' },
          description: 'Array of task IDs to update'
        },
        status: { 
          enum: Object.values(TaskStatus),
          description: 'New status to set for all specified tasks'
        }
      },
      required: ['taskIds', 'status']
    }
  })
  @ApiOkResponse({
    description: 'Tasks have been successfully updated.',
  })
  bulkUpdateStatus(@Body() body: { taskIds: number[]; status: TaskStatus }) {
    return this.schedulerService.bulkUpdateStatus(body.taskIds, body.status);
  }

  @Get('queue/status')
  @ApiOperation({ 
    summary: 'Get queue status',
    description: 'Retrieves the current status of the task processing queue including waiting, active, completed and failed job counts'
  })
  @ApiOkResponse({
    description: 'Queue status information.',
    schema: {
      type: 'object',
      properties: {
        waiting: { type: 'number', description: 'Number of jobs waiting to be processed' },
        active: { type: 'number', description: 'Number of jobs currently being processed' },
        completed: { type: 'number', description: 'Number of completed jobs' },
        failed: { type: 'number', description: 'Number of failed jobs' }
      }
    }
  })
  getQueueStatus() {
    return this.taskQueueService.getQueueInfo();
  }
}
