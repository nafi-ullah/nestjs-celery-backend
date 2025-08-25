import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HellobuddyModule } from './hellobuddy/hellobuddy.module';

@Module({
  imports: [HellobuddyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
