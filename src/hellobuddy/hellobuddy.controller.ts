import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { HellobuddyService } from './hellobuddy.service';
import { CreateHelloDto } from './dto/create-hellobuddy.dto';

@ApiTags('hellobuddy')
@Controller('hellobuddy')
export class HelloBuddyController {
  constructor(private readonly helloService: HellobuddyService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create hello buddy task',
    description: 'Creates a new hello buddy task and adds it to the processing queue'
  })
  @ApiCreatedResponse({
    description: 'The hello buddy task has been successfully created and queued for processing.',
  })
  @ApiBody({ type: CreateHelloDto })
  create(@Body() dto: CreateHelloDto) {
    return this.helloService.create(dto);
  }
}
