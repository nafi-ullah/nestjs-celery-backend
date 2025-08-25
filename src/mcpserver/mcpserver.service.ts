import { Injectable } from '@nestjs/common';
import { McpAgentRequestDto } from './dto/mcp-agent-request.dto';
import { CalculatorTool } from './tools/calculator.tool';
import { OpenAILLMTool } from './tools/openai-llm.tool';
import { KnowledgeBaseTool } from './tools/knowledge-base.tool';
import { McpTool } from './interfaces/mcp-tools.interface';

@Injectable()
export class McpserverService {
  private tools: Map<string, McpTool>;

  constructor() {
    this.tools = new Map();
    this.initializeTools();
  }

  private initializeTools() {
    const calculatorTool = new CalculatorTool();
    const openaiTool = new OpenAILLMTool();
    const knowledgeBaseTool = new KnowledgeBaseTool();

    this.tools.set(calculatorTool.name, calculatorTool);
    this.tools.set(openaiTool.name, openaiTool);
    this.tools.set(knowledgeBaseTool.name, knowledgeBaseTool);
  }

  async processMcpAgent(requestDto: McpAgentRequestDto): Promise<any> {
    const { task, instruction, parameters, tools, productId, llmPrompt, calculationData } = requestDto;

    try {
      const result = await this.executeTask(task, {
        instruction,
        parameters,
        tools,
        productId,
        llmPrompt,
        calculationData
      });

      return {
        status: 'success',
        task,
        result,
        timestamp: new Date().toISOString(),
        toolsUsed: result.toolsUsed || []
      };
    } catch (error) {
      return {
        status: 'error',
        task,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async executeTask(task: string, context: any): Promise<any> {
    const toolsUsed: string[] = [];
    let result: any = {};

    switch (task.toLowerCase()) {
      case 'get_product_nutrition':
        result = await this.getProductNutrition(context.productId, toolsUsed);
        break;

      case 'calculate_nutrition_with_llm':
        result = await this.calculateNutritionWithLLM(context, toolsUsed);
        break;

      case 'search_products':
        result = await this.searchProducts(context.parameters, toolsUsed);
        break;

      case 'calculate_values':
        result = await this.calculateValues(context.calculationData, toolsUsed);
        break;

      case 'llm_query':
        result = await this.llmQuery(context.llmPrompt, context.instruction, toolsUsed);
        break;

      case 'complex_nutrition_analysis':
        result = await this.complexNutritionAnalysis(context, toolsUsed);
        break;

      default:
        // Try to execute custom task based on instruction
        result = await this.executeCustomTask(task, context, toolsUsed);
    }

    result.toolsUsed = toolsUsed;
    return result;
  }

  private async getProductNutrition(productId: string, toolsUsed: string[]): Promise<any> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const knowledgeBaseTool = this.tools.get('knowledge_base');
    if (!knowledgeBaseTool) {
      throw new Error('Knowledge base tool not available');
    }
    
    toolsUsed.push('knowledge_base');
    return await knowledgeBaseTool.execute({ productId });
  }

  private async calculateNutritionWithLLM(context: any, toolsUsed: string[]): Promise<any> {
    // First get product data
    const productData = await this.getProductNutrition(context.productId, toolsUsed);
    
    // Use LLM to analyze nutrition
    const llmTool = this.tools.get('openai_llm');
    if (!llmTool) {
      throw new Error('OpenAI LLM tool not available');
    }
    
    toolsUsed.push('openai_llm');
    
    const prompt = context.llmPrompt || 
      `Analyze the nutritional information for ${productData.product.name}. 
       Nutrition per 100g: ${JSON.stringify(productData.nutritionInfo)}
       Actual weight: ${productData.product.weight}
       Please provide insights about calories, protein content, and health benefits.`;

    const llmResult = await llmTool.execute({
      prompt,
      systemMessage: 'You are a nutrition expert. Provide accurate nutritional analysis and recommendations.'
    });

    // If LLM response contains numeric data, we can use calculator
    if (llmResult.parsed_json && context.calculationData) {
      const calculatorTool = this.tools.get('calculator');
      if (!calculatorTool) {
        throw new Error('Calculator tool not available');
      }
      
      toolsUsed.push('calculator');
      const calculationResult = await calculatorTool.execute(context.calculationData);
      
      return {
        productData,
        llmAnalysis: llmResult,
        calculations: calculationResult
      };
    }

    return {
      productData,
      llmAnalysis: llmResult
    };
  }

  private async searchProducts(parameters: any, toolsUsed: string[]): Promise<any> {
    const knowledgeBaseTool = this.tools.get('knowledge_base');
    if (!knowledgeBaseTool) {
      throw new Error('Knowledge base tool not available');
    }
    
    toolsUsed.push('knowledge_base');
    return await knowledgeBaseTool.execute(parameters);
  }

  private async calculateValues(calculationData: any, toolsUsed: string[]): Promise<any> {
    if (!calculationData) {
      throw new Error('Calculation data is required');
    }

    const calculatorTool = this.tools.get('calculator');
    if (!calculatorTool) {
      throw new Error('Calculator tool not available');
    }
    
    toolsUsed.push('calculator');
    return await calculatorTool.execute(calculationData);
  }

  private async llmQuery(prompt: string, instruction: string, toolsUsed: string[]): Promise<any> {
    if (!prompt) {
      throw new Error('Prompt is required for LLM query');
    }

    const llmTool = this.tools.get('openai_llm');
    if (!llmTool) {
      throw new Error('OpenAI LLM tool not available');
    }
    
    toolsUsed.push('openai_llm');
    return await llmTool.execute({
      prompt,
      systemMessage: instruction || 'You are a helpful assistant.'
    });
  }

  private async complexNutritionAnalysis(context: any, toolsUsed: string[]): Promise<any> {
    // Example of complex workflow combining multiple tools
    const results: any = {};

    // Step 1: Get product information
    if (context.productId) {
      results.productInfo = await this.getProductNutrition(context.productId, toolsUsed);
    }

    // Step 2: Use LLM to extract specific nutrition values
    if (context.llmPrompt && results.productInfo) {
      const llmTool = this.tools.get('openai_llm');
      if (!llmTool) {
        throw new Error('OpenAI LLM tool not available');
      }
      
      toolsUsed.push('openai_llm');
      
      const nutritionPrompt = `Based on this product data: ${JSON.stringify(results.productInfo.product)}
        ${context.llmPrompt}
        Please respond with a JSON object containing the requested nutritional calculations.`;

      results.llmExtraction = await llmTool.execute({
        prompt: nutritionPrompt,
        systemMessage: 'Extract and calculate nutritional information. Always respond with valid JSON.'
      });
    }

    // Step 3: Perform calculations if numeric data is available
    if (results.llmExtraction && results.llmExtraction.parsed_json && context.calculationData) {
      const calculatorTool = this.tools.get('calculator');
      if (!calculatorTool) {
        throw new Error('Calculator tool not available');
      }
      
      toolsUsed.push('calculator');
      results.calculations = await calculatorTool.execute(context.calculationData);
    }

    return results;
  }

  private async executeCustomTask(task: string, context: any, toolsUsed: string[]): Promise<any> {
    // Parse task instruction and try to determine which tools to use
    const instruction = context.instruction || '';
    const lowerInstruction = instruction.toLowerCase();

    let result: any = { customTask: task };

    // Check if instruction mentions specific tools or actions
    if (lowerInstruction.includes('calculate') || lowerInstruction.includes('math')) {
      if (context.calculationData) {
        const calculatorTool = this.tools.get('calculator');
        if (!calculatorTool) {
          throw new Error('Calculator tool not available');
        }
        
        toolsUsed.push('calculator');
        result.calculation = await calculatorTool.execute(context.calculationData);
      }
    }

    if (lowerInstruction.includes('product') || lowerInstruction.includes('food') || context.productId) {
      const knowledgeBaseTool = this.tools.get('knowledge_base');
      if (!knowledgeBaseTool) {
        throw new Error('Knowledge base tool not available');
      }
      
      toolsUsed.push('knowledge_base');
      result.productInfo = await knowledgeBaseTool.execute({ 
        productId: context.productId,
        query: context.parameters?.query,
        category: context.parameters?.category
      });
    }

    if (lowerInstruction.includes('analyze') || lowerInstruction.includes('llm') || context.llmPrompt) {
      const llmTool = this.tools.get('openai_llm');
      if (!llmTool) {
        throw new Error('OpenAI LLM tool not available');
      }
      
      toolsUsed.push('openai_llm');
      result.llmResponse = await llmTool.execute({
        prompt: context.llmPrompt || instruction,
        systemMessage: context.parameters?.systemMessage
      });
    }

    return result;
  }

  getAvailableTools(): string[] {
    return Array.from(this.tools.keys());
  }
}
