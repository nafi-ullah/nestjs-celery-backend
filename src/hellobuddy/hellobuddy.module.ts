import { Module } from '@nestjs/common';
import { HellobuddyService } from './hellobuddy.service';
import { HelloBuddyController } from './hellobuddy.controller';

@Module({
  controllers: [HelloBuddyController],
  providers: [HellobuddyService]
})
export class HellobuddyModule {}
