import { Injectable } from '@nestjs/common';
import { McpTool, CalculatorParams } from '../interfaces/mcp-tools.interface';

@Injectable()
export class CalculatorTool implements McpTool {
  name = 'calculator';

  async execute(parameters: CalculatorParams): Promise<any> {
    const { operation, values } = parameters;

    if (!values || values.length === 0) {
      throw new Error('No values provided for calculation');
    }

    let result: number;

    switch (operation) {
      case 'add':
        result = values.reduce((sum, val) => sum + val, 0);
        break;
      
      case 'subtract':
        result = values.reduce((diff, val, index) => index === 0 ? val : diff - val);
        break;
      
      case 'multiply':
        result = values.reduce((product, val) => product * val, 1);
        break;
      
      case 'divide':
        result = values.reduce((quotient, val, index) => {
          if (index === 0) return val;
          if (val === 0) throw new Error('Division by zero');
          return quotient / val;
        });
        break;
      
      case 'percentage':
        if (values.length !== 2) {
          throw new Error('Percentage calculation requires exactly 2 values');
        }
        result = (values[0] / values[1]) * 100;
        break;
      
      case 'average':
        result = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    return {
      operation,
      values,
      result,
      formatted: this.formatResult(result, operation)
    };
  }

  private formatResult(result: number, operation: string): string {
    const rounded = Math.round(result * 100) / 100;
    
    if (operation === 'percentage') {
      return `${rounded}%`;
    }
    
    return rounded.toString();
  }
}
