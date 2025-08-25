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
  HttpStatus
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
  ApiNoContentResponse
} from '@nestjs/swagger';
import { SchedulerService } from './scheduler.service';
import { CreateSchedulerTaskDto } from './dto/create-scheduler-task.dto';
import { UpdateSchedulerTaskDto } from './dto/update-scheduler-task.dto';
import { CreateMultipleSchedulerTasksDto } from './dto/create-multiple-scheduler-tasks.dto';
import { SchedulerTask } from './entities/scheduler-task.entity';

@ApiTags('scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

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
}
