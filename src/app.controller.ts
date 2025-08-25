import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get application status',
    description: 'Returns a simple greeting message to verify the application is running'
  })
  @ApiOkResponse({
    description: 'Application status message',
    type: String,
    example: 'Hello World!'
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
