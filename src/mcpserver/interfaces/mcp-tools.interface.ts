export interface McpTool {
  name: string;
  execute(parameters: any): Promise<any>;
}

export interface CalculatorParams {
  operation: 'add' | 'subtract' | 'multiply' | 'divide' | 'percentage' | 'average';
  values: number[];
}

export interface OpenAIParams {
  prompt: string;
  systemMessage?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface KnowledgeBaseParams {
  productId?: string;
  query?: string;
  category?: string;
}
