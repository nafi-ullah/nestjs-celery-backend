# Swagger API Documentation Setup

This document explains how to use the Swagger API documentation that has been integrated into the FuelAI Backend application.

## 🚀 Quick Start

1. **Start the application**:
   ```bash
   npm run start:dev
   ```

2. **Access Swagger UI**:
   - Open your browser and navigate to: `http://localhost:3000/api`
   - The interactive API documentation will be available immediately

## 📋 What's Included

### API Modules Documented

#### 1. **Scheduler Module** (`/scheduler`)
- ✅ Create single scheduler task
- ✅ Create multiple scheduler tasks
- ✅ Get all scheduler tasks
- ✅ Get scheduler task by ID
- ✅ Update scheduler task
- ✅ Delete scheduler task

#### 2. **HelloBuddy Module** (`/hellobuddy`)
- ✅ Create hello buddy task
- ✅ Queue processing with Bull

#### 3. **MCP Server Module** (`/mcpserver`)
- ✅ Process MCP agent requests (async)
- ✅ Process MCP agent requests (sync)
- ✅ Get available tools
- ✅ Get request examples

#### 4. **App Module** (`/`)
- ✅ Application status check

### Features Added

- **Interactive API Testing**: Test all endpoints directly from the browser
- **Request/Response Examples**: See sample requests and responses
- **Schema Validation**: View data models and validation rules
- **Error Documentation**: Understand possible error responses
- **Authentication Ready**: Bearer token authentication support (when needed)

## 🎯 Using Swagger UI

### Testing Endpoints

1. **Expand any endpoint** by clicking on it
2. **Click "Try it out"** to enable the form
3. **Fill in the parameters** using the provided examples
4. **Click "Execute"** to send the request
5. **View the response** including status code, headers, and body

### Example Requests

#### Create a Scheduler Task
```json
{
  "task": "process_product_data",
  "instruction": "Process the product data and generate insights",
  "parameters": {
    "batchSize": 100,
    "includeAnalytics": true
  },
  "tools": ["calculator", "data-processor", "analytics"],
  "productId": "PROD-12345",
  "llmPrompt": "Analyze the product data and provide insights",
  "calculationData": {
    "revenue": 50000,
    "cost": 30000,
    "margin": 20000
  },
  "scheduleTime": "2025-08-26T10:30:00Z",
  "comment": "Monthly product analysis task"
}
```

#### MCP Agent Request
```json
{
  "task": "get_product_nutrition",
  "productId": "1",
  "instruction": "Get nutritional information for the product"
}
```

#### HelloBuddy Request
```json
{
  "a": 42,
  "b": "hello world",
  "c": true,
  "d": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

## 📊 Swagger Configuration Details

### Features Enabled
- **Persistent Authorization**: Login tokens are remembered across page refreshes
- **Request Duration Display**: See how long each request takes
- **Comprehensive Tags**: Organized by module for easy navigation
- **Detailed Descriptions**: Every endpoint has clear documentation
- **Example Values**: All fields include sample data

### URL Structure
- **Swagger UI**: `http://localhost:3000/api`
- **Swagger JSON**: `http://localhost:3000/api-json`

## 🛠 Development Features

### Auto-Generated Documentation
- **DTOs**: All Data Transfer Objects are fully documented
- **Entities**: Database models include field descriptions
- **Validation**: Input validation rules are visible in the schema
- **Response Types**: Expected response structures are clearly defined

### Error Handling
- **Status Codes**: All possible HTTP status codes are documented
- **Error Responses**: Example error messages for troubleshooting
- **Validation Errors**: Clear indication of required fields and formats

## 🔧 Customization

The Swagger configuration is located in `src/main.ts` and can be customized:

```typescript
const config = new DocumentBuilder()
  .setTitle('FuelAI Backend API')
  .setDescription('API documentation for FuelAI Backend')
  .setVersion('1.0')
  .addTag('scheduler', 'Scheduler task management')
  .addBearerAuth() // For authentication
  .build();
```

## 📝 Best Practices

### For API Users
1. **Start with Examples**: Use the provided examples as templates
2. **Check Required Fields**: Required fields are marked with a red asterisk
3. **Validate Responses**: Compare actual responses with documented schemas
4. **Use Try It Out**: Test endpoints directly in the browser

### For Developers
1. **Keep Descriptions Updated**: Update API descriptions when changing endpoints
2. **Add Examples**: Include realistic example data for all fields
3. **Document Error Cases**: Add documentation for all possible error scenarios
4. **Use Proper HTTP Status Codes**: Follow REST conventions

## 🚀 Production Considerations

### Security
- **Authentication**: Enable bearer token authentication for protected endpoints
- **Rate Limiting**: Consider adding rate limiting for public APIs
- **HTTPS**: Use HTTPS in production environments

### Performance
- **Caching**: Enable response caching for static endpoints
- **Pagination**: Implement pagination for large data sets
- **Filtering**: Add query parameters for data filtering

## 📚 Additional Resources

- **NestJS Swagger**: [Official Documentation](https://docs.nestjs.com/openapi/introduction)
- **OpenAPI Specification**: [OpenAPI 3.0](https://swagger.io/specification/)
- **Swagger UI**: [User Guide](https://swagger.io/docs/open-source-tools/swagger-ui/)

---

**Happy API Testing! 🎉**

Your Swagger documentation is now live at `http://localhost:3000/api` when the application is running.
