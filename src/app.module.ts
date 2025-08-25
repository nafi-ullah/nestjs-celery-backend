import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HellobuddyModule } from './hellobuddy/hellobuddy.module';
import { McpserverModule } from './mcpserver/mcpserver.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SchedulerTask } from './scheduler/entities/scheduler-task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'pythonuser',
      password: 'dmc54321',
      database: 'fuelai_db',
      entities: [SchedulerTask],
      synchronize: true, // This will automatically create tables
      logging: false,
    }),
    BullModule.forRoot({
      redis: {
        host: '127.0.0.1',
        port: 6379,
        password: 'redispass',
      },
      prefix: 'fuelai',
    }),
    HellobuddyModule,
    McpserverModule,
    SchedulerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
