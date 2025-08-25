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
import { SchedulerService } from './scheduler.service';
import { CreateSchedulerTaskDto } from './dto/create-scheduler-task.dto';
import { UpdateSchedulerTaskDto } from './dto/update-scheduler-task.dto';
import { CreateMultipleSchedulerTasksDto } from './dto/create-multiple-scheduler-tasks.dto';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post()
  create(@Body() createSchedulerTaskDto: CreateSchedulerTaskDto) {
    return this.schedulerService.create(createSchedulerTaskDto);
  }

  @Post('multiple')
  createMultiple(@Body() createMultipleDto: CreateMultipleSchedulerTasksDto) {
    return this.schedulerService.createMultiple(createMultipleDto);
  }

  @Get()
  findAll() {
    return this.schedulerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateSchedulerTaskDto: UpdateSchedulerTaskDto
  ) {
    return this.schedulerService.update(id, updateSchedulerTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.schedulerService.remove(id);
  }
}
