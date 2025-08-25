import { Controller, Post, Body, Get } from '@nestjs/common';
import { McpserverService } from './mcpserver.service';
import { McpAgentRequestDto } from './dto/mcp-agent-request.dto';

@Controller('mcpserver')
export class McpserverController {
  constructor(private readonly mcpserverService: McpserverService) {}

  @Post('mcpagent')
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
  async processMcpAgentSync(@Body() requestDto: McpAgentRequestDto) {
    return await this.mcpserverService.processMcpAgent(requestDto);
  }

  @Get('tools')
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
