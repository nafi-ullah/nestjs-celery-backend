import { IsString, IsOptional, IsObject, IsArray } from 'class-validator';

export class McpAgentRequestDto {
  @IsString()
  task: string;

  @IsOptional()
  @IsString()
  instruction?: string;

  @IsOptional()
  @IsObject()
  parameters?: Record<string, any>;

  @IsOptional()
  @IsArray()
  tools?: string[];

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  llmPrompt?: string;

  @IsOptional()
  @IsObject()
  calculationData?: Record<string, number>;
}
