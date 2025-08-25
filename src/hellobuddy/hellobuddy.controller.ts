import { Body, Controller, Post } from '@nestjs/common';
import { HellobuddyService } from './hellobuddy.service';
import { CreateHelloDto } from './dto/create-hellobuddy.dto';




@Controller('hellobuddy')
export class HelloBuddyController {
  constructor(private readonly helloService: HellobuddyService) {}

  @Post()
  create(@Body() dto: CreateHelloDto) {
    return this.helloService.create(dto);
  }
}
