import { IsString, IsOptional, IsObject, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class McpAgentRequestDto {
  @ApiProperty({
    description: 'The task to be performed by the MCP agent',
    example: 'get_product_nutrition',
    examples: [
      'get_product_nutrition',
      'calculate_nutrition_with_llm',
      'search_products',
      'calculate_values',
      'llm_query'
    ]
  })
  @IsString()
  task: string;

  @ApiPropertyOptional({
    description: 'Additional instructions for the task',
    example: 'You are a nutritionist. Provide evidence-based health information.'
  })
  @IsOptional()
  @IsString()
  instruction?: string;

  @ApiPropertyOptional({
    description: 'Parameters for the task execution',
    example: { category: 'Fruits', limit: 10 }
  })
  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Tools to be used for the task',
    example: ['calculator', 'knowledge_base'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  tools?: string[];

  @ApiPropertyOptional({
    description: 'Product ID for product-related tasks',
    example: '1'
  })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Prompt for LLM-based tasks',
    example: 'What are the health benefits of eating almonds?'
  })
  @IsOptional()
  @IsString()
  llmPrompt?: string;

  @ApiPropertyOptional({
    description: 'Numerical data for calculations',
    example: { operation: 'multiply', values: [150, 2.5] }
  })
  @IsOptional()
  @IsObject()
  calculationData?: Record<string, number>;
}
