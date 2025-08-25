import { Module } from '@nestjs/common';
import { McpserverController } from './mcpserver.controller';
import { McpserverService } from './mcpserver.service';

@Module({
  controllers: [McpserverController],
  providers: [McpserverService]
})
export class McpserverModule {}
