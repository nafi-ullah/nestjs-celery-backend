# MCP Server Module

A comprehensive Model Context Protocol (MCP) server implementation in NestJS that provides intelligent agent capabilities with multiple tools for food nutrition analysis, calculations, and AI-powered insights.

## Features

### 🛠️ Available Tools

1. **Calculator Tool** - Perform mathematical operations
2. **OpenAI LLM Tool** - AI-powered text analysis and generation
3. **Knowledge Base Tool** - Food product database queries

### 🚀 API Endpoints

#### POST `/mcpserver/mcpagent`
Main endpoint for MCP agent requests. Returns immediate acknowledgment while processing asynchronously.

**Request Body:**
```json
{
  "task": "string",
  "instruction": "string (optional)",
  "parameters": "object (optional)",
  "tools": "array (optional)",
  "productId": "string (optional)",
  "llmPrompt": "string (optional)",
  "calculationData": "object (optional)"
}
```

#### POST `/mcpserver/mcpagent/sync`
Synchronous version that waits for processing to complete.

#### GET `/mcpserver/tools`
Returns available tools and their descriptions.

#### GET `/mcpserver/examples`
Returns example requests for different use cases.

## Supported Tasks

### 1. Get Product Nutrition
```json
{
  "task": "get_product_nutrition",
  "productId": "1"
}
```

### 2. Calculate Nutrition with LLM
```json
{
  "task": "calculate_nutrition_with_llm",
  "productId": "3",
  "llmPrompt": "Calculate the daily protein percentage for a 70kg person",
  "calculationData": {
    "operation": "percentage",
    "values": [31, 56]
  }
}
```

### 3. Search Products
```json
{
  "task": "search_products",
  "parameters": {
    "category": "Fruits"
  }
}
```

### 4. Calculate Values
```json
{
  "task": "calculate_values",
  "calculationData": {
    "operation": "multiply",
    "values": [150, 2.5]
  }
}
```

### 5. LLM Query
```json
{
  "task": "llm_query",
  "llmPrompt": "What are the health benefits of eating almonds?",
  "instruction": "You are a nutritionist"
}
```

### 6. Complex Nutrition Analysis
```json
{
  "task": "complex_nutrition_analysis",
  "productId": "1",
  "llmPrompt": "Analyze calories and provide recommendations",
  "calculationData": {
    "operation": "add",
    "values": [100, 50]
  }
}
```

## Calculator Operations

- `add` - Sum all values
- `subtract` - Subtract values sequentially
- `multiply` - Multiply all values
- `divide` - Divide values sequentially
- `percentage` - Calculate percentage (requires exactly 2 values)
- `average` - Calculate average of all values

## Food Product Database

The knowledge base contains 8 sample food products with detailed nutritional information:

1. **Apple** (ID: 1) - Fresh red apple
2. **Banana** (ID: 2) - Fresh yellow banana
3. **Chicken Breast** (ID: 3) - Skinless chicken breast
4. **Brown Rice** (ID: 4) - Cooked brown rice
5. **Greek Yogurt** (ID: 5) - Plain Greek yogurt
6. **Spinach** (ID: 6) - Fresh spinach leaves
7. **Almonds** (ID: 7) - Raw almonds
8. **Salmon Fillet** (ID: 8) - Fresh Atlantic salmon

Each product includes:
- Basic information (name, category, description, weight, price)
- Nutritional data per 100g (calories, protein, carbs, fiber, sugar, fat, vitamins, minerals)
- Calculated nutrition for actual product weight

## Setup

### 1. Environment Variables
Create a `.env` file based on `.env.example`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=redispass
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Redis (if not already running)
```bash
sudo systemctl start redis-server
```

### 4. Run the Application
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Usage Examples

### Example 1: Get Apple Nutrition
```bash
curl -X POST http://localhost:3000/mcpserver/mcpagent \
  -H "Content-Type: application/json" \
  -d '{
    "task": "get_product_nutrition",
    "productId": "1"
  }'
```

### Example 2: Complex Nutrition Analysis
```bash
curl -X POST http://localhost:3000/mcpserver/mcpagent \
  -H "Content-Type: application/json" \
  -d '{
    "task": "complex_nutrition_analysis",
    "productId": "3",
    "llmPrompt": "Calculate how much protein this provides for a 70kg person",
    "calculationData": {
      "operation": "percentage",
      "values": [31, 56]
    }
  }'
```

### Example 3: Search by Category
```bash
curl -X POST http://localhost:3000/mcpserver/mcpagent \
  -H "Content-Type: application/json" \
  -d '{
    "task": "search_products",
    "parameters": {
      "category": "Fruits"
    }
  }'
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "task": "task_name",
  "result": { /* task-specific results */ },
  "timestamp": "2025-08-25T...",
  "toolsUsed": ["tool1", "tool2"]
}
```

### Error Response
```json
{
  "status": "error",
  "task": "task_name",
  "error": "error message",
  "timestamp": "2025-08-25T..."
}
```

## Architecture

```
McpserverController
├── POST /mcpagent (async)
├── POST /mcpagent/sync
├── GET /tools
└── GET /examples

McpserverService
├── Tool Management
├── Task Execution
└── Workflow Orchestration

Tools
├── CalculatorTool
├── OpenAILLMTool
└── KnowledgeBaseTool

Data
└── food-products.json
```

## Error Handling

The MCP server includes comprehensive error handling:
- Tool availability checks
- Input validation
- OpenAI API error handling
- Calculation error handling
- JSON parsing error handling

## Extensibility

The module is designed for easy extension:
1. **Add new tools** by implementing the `McpTool` interface
2. **Add new tasks** by extending the `executeTask` method
3. **Expand the knowledge base** by updating `food-products.json`
4. **Add new data sources** by creating additional tool implementations

## Dependencies

- `@nestjs/common` - NestJS framework
- `openai` - OpenAI API client
- `class-validator` - Request validation
- `class-transformer` - Data transformation
