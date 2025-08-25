import { Injectable } from '@nestjs/common';
import { McpTool, KnowledgeBaseParams } from '../interfaces/mcp-tools.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KnowledgeBaseTool implements McpTool {
  name = 'knowledge_base';
  private foodData: any;

  constructor() {
    this.loadFoodData();
  }

  private loadFoodData() {
    try {
      // Try multiple possible paths to find the JSON file
      const possiblePaths = [
        path.join(__dirname, '../data/food-products.json'),
        path.join(process.cwd(), 'src/mcpserver/data/food-products.json'),
        path.join(process.cwd(), 'dist/mcpserver/data/food-products.json')
      ];

      let rawData: string = '';
      let foundPath = '';

      for (const filePath of possiblePaths) {
        try {
          rawData = fs.readFileSync(filePath, 'utf8');
          foundPath = filePath;
          break;
        } catch (error) {
          // Continue to next path
          continue;
        }
      }

      if (!rawData) {
        throw new Error('Could not find food-products.json in any expected location');
      }

      this.foodData = JSON.parse(rawData);
      console.log(`Loaded food data from: ${foundPath}`);
    } catch (error) {
      console.error('Error loading food data:', error);
      this.foodData = { products: [] };
    }
  }

  async execute(parameters: KnowledgeBaseParams): Promise<any> {
    const { productId, query, category } = parameters;

    if (productId) {
      return this.getProductById(productId);
    }

    if (category) {
      return this.getProductsByCategory(category);
    }

    if (query) {
      return this.searchProducts(query);
    }

    return {
      products: this.foodData.products,
      total: this.foodData.products.length,
      categories: this.getAvailableCategories()
    };
  }

  private getProductById(productId: string): any {
    const product = this.foodData.products.find(p => p.id === productId);
    
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    return {
      product,
      nutritionInfo: product.nutritionPer100g,
      calculatedNutritionForActualWeight: this.calculateNutritionForWeight(product)
    };
  }

  private getProductsByCategory(category: string): any {
    const products = this.foodData.products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );

    return {
      category,
      products,
      count: products.length
    };
  }

  private searchProducts(query: string): any {
    const searchTerm = query.toLowerCase();
    const products = this.foodData.products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );

    return {
      query,
      products,
      count: products.length
    };
  }

  private getAvailableCategories(): string[] {
    const categories = [...new Set(this.foodData.products.map((p: any) => p.category))];
    return categories.filter((cat): cat is string => typeof cat === 'string');
  }

  private calculateNutritionForWeight(product: any): any {
    const actualWeight = parseFloat(product.weight);
    const weightMultiplier = actualWeight / 100; // Convert to per 100g ratio

    const calculatedNutrition = {};
    for (const [key, value] of Object.entries(product.nutritionPer100g)) {
      calculatedNutrition[key] = Math.round((value as number) * weightMultiplier * 100) / 100;
    }

    return {
      forWeight: product.weight,
      nutrition: calculatedNutrition
    };
  }
}
