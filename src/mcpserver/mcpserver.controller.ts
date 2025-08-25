import { Controller, Post, Body, Get } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiOkResponse, 
  ApiCreatedResponse, 
  ApiBody 
} from '@nestjs/swagger';
import { McpserverService } from './mcpserver.service';
import { McpAgentRequestDto } from './dto/mcp-agent-request.dto';

@ApiTags('mcpserver')
@Controller('mcpserver')
export class McpserverController {
  constructor(private readonly mcpserverService: McpserverService) {}

  @Post('mcpagent')
  @ApiOperation({ 
    summary: 'Process MCP Agent request (Async)',
    description: 'Submits an MCP Agent request for asynchronous processing. Returns immediate acknowledgment.'
  })
  @ApiCreatedResponse({
    description: 'Request accepted for processing',
    example: {
      status: 'accepted',
      message: 'MCP Agent will work on your request',
      taskId: 'task_1693123456789_abc123def',
      timestamp: '2025-08-25T12:00:00.000Z',
      estimatedProcessingTime: '5-30 seconds'
    }
  })
  @ApiBody({ type: McpAgentRequestDto })
  async processMcpAgent(@Body() requestDto: McpAgentRequestDto) {
    try {
      // Immediately acknowledge the request
      const acknowledgment = {
        status: 'accepted',
        message: 'MCP Agent will work on your request',
        taskId: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        estimatedProcessingTime: '5-30 seconds'
      };

      // Process the request asynchronously
      setImmediate(async () => {
        try {
          const result = await this.mcpserverService.processMcpAgent(requestDto);
          console.log('MCP Agent processing completed:', result);
        } catch (error) {
          console.error('MCP Agent processing failed:', error);
        }
      });

      return acknowledgment;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to accept request',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('mcpagent/sync')
  @ApiOperation({ 
    summary: 'Process MCP Agent request (Sync)',
    description: 'Processes an MCP Agent request synchronously and returns the result immediately.'
  })
  @ApiOkResponse({
    description: 'MCP Agent processing result'
  })
  @ApiBody({ type: McpAgentRequestDto })
  async processMcpAgentSync(@Body() requestDto: McpAgentRequestDto) {
    return await this.mcpserverService.processMcpAgent(requestDto);
  }

  @Get('tools')
  @ApiOperation({ 
    summary: 'Get available MCP tools',
    description: 'Returns a list of available MCP tools and their descriptions'
  })
  @ApiOkResponse({
    description: 'List of available MCP tools',
    example: {
      tools: ['calculator', 'openai_llm', 'knowledge_base'],
      description: 'Available MCP tools',
      usage: {
        calculator: 'Perform mathematical calculations',
        openai_llm: 'Use OpenAI for text analysis and generation',
        knowledge_base: 'Query food product information'
      }
    }
  })
  getAvailableTools() {
    return {
      tools: this.mcpserverService.getAvailableTools(),
      description: 'Available MCP tools',
      usage: {
        calculator: 'Perform mathematical calculations',
        openai_llm: 'Use OpenAI for text analysis and generation',
        knowledge_base: 'Query food product information'
      }
    };
  }

  @Get('examples')
  @ApiOperation({ 
    summary: 'Get MCP request examples',
    description: 'Returns example requests that can be used with the MCP server'
  })
  @ApiOkResponse({
    description: 'List of example MCP requests'
  })
  getExamples() {
    return {
      examples: [
        {
          name: 'Get Product Nutrition',
          request: {
            task: 'get_product_nutrition',
            productId: '1'
          }
        },
        {
          name: 'Calculate with LLM',
          request: {
            task: 'calculate_nutrition_with_llm',
            productId: '3',
            llmPrompt: 'Calculate the daily protein percentage for a 70kg person if they eat this chicken breast',
            calculationData: {
              operation: 'percentage',
              values: [31, 56] // protein content vs daily requirement
            }
          }
        },
        {
          name: 'Search Products',
          request: {
            task: 'search_products',
            parameters: {
              category: 'Fruits'
            }
          }
        },
        {
          name: 'Simple Calculation',
          request: {
            task: 'calculate_values',
            calculationData: {
              operation: 'multiply',
              values: [150, 2.5] // weight * multiplier
            }
          }
        },
        {
          name: 'LLM Query',
          request: {
            task: 'llm_query',
            llmPrompt: 'What are the health benefits of eating almonds?',
            instruction: 'You are a nutritionist. Provide evidence-based health information.'
          }
        }
      ]
    };
  }
}
