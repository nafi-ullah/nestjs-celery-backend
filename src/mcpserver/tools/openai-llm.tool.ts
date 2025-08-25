import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { McpTool, OpenAIParams } from '../interfaces/mcp-tools.interface';

@Injectable()
export class OpenAILLMTool implements McpTool {
  name = 'openai_llm';
  private openai: OpenAI;

  constructor() {
    // Initialize OpenAI client - API key should be provided via environment variable
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });
  }

  async execute(parameters: OpenAIParams): Promise<any> {
    const { 
      prompt, 
      systemMessage = 'You are a helpful assistant. Provide accurate and concise responses.',
      maxTokens = 150,
      temperature = 0.7
    } = parameters;

    // Check if OpenAI client is properly initialized (API key is available)
    if (!this.openai.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      });

      const response = completion.choices[0]?.message?.content || '';
      
      return {
        prompt,
        response,
        model: 'gpt-3.5-turbo',
        tokens_used: completion.usage?.total_tokens || 0,
        parsed_json: this.tryParseJSON(response)
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  private tryParseJSON(text: string): any {
    try {
      // Look for JSON patterns in the response
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Try to extract numbers if it's a simple numeric response
      const numberMatch = text.match(/\d+\.?\d*/);
      if (numberMatch) {
        return { value: parseFloat(numberMatch[0]) };
      }
      
      return null;
    } catch {
      return null;
    }
  }
}
