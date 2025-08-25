import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HellobuddyModule } from './hellobuddy/hellobuddy.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
        password: 'redispass',
      },
      prefix: 'fuelai',
    }),
    HellobuddyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
