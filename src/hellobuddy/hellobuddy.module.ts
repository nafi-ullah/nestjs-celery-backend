import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HellobuddyService } from './hellobuddy.service';
import { HelloBuddyController } from './hellobuddy.controller';
import { HellobuddyProcessor } from './hellobuddy.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'hellobuddy-queue',
    }),
  ],
  controllers: [HelloBuddyController],
  providers: [HellobuddyService, HellobuddyProcessor]
})
export class HellobuddyModule {}
