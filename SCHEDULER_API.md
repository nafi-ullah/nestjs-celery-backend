# Scheduler API Documentation

This document provides comprehensive documentation for the Scheduler API endpoints, which manage scheduled tasks in the system.

## Base URL
```
/scheduler
```

## Endpoints

### 1. Create a Single Scheduler Task

**POST** `/scheduler`

Creates a new scheduler task.

#### Request Body
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
  "status": "pending",
  "scheduleTime": "2025-08-26T10:30:00Z",
  "comment": "Monthly product analysis task"
}
```

#### Response
```json
{
  "taskId": 1,
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
  "status": "pending",
  "createdAt": "2025-08-25T12:00:00.000Z",
  "scheduleTime": "2025-08-26T10:30:00.000Z",
  "comment": "Monthly product analysis task"
}
```

### 2. Create Multiple Scheduler Tasks

**POST** `/scheduler/multiple`

Creates multiple scheduler tasks in a single request.

#### Request Body
```json
{
  "tasks": [
    {
      "task": "backup_database",
      "instruction": "Create a backup of the main database",
      "scheduleTime": "2025-08-26T02:00:00Z",
      "comment": "Daily database backup"
    },
    {
      "task": "generate_reports",
      "instruction": "Generate daily sales reports",
      "parameters": {
        "reportType": "sales",
        "period": "daily"
      },
      "scheduleTime": "2025-08-26T06:00:00Z",
      "comment": "Daily sales report generation"
    },
    {
      "task": "cleanup_logs",
      "instruction": "Clean up old log files",
      "parameters": {
        "retentionDays": 30
      },
      "scheduleTime": "2025-08-26T03:00:00Z",
      "comment": "Weekly log cleanup"
    }
  ]
}
```

#### Response
```json
[
  {
    "taskId": 2,
    "task": "backup_database",
    "instruction": "Create a backup of the main database",
    "parameters": null,
    "tools": null,
    "productId": null,
    "llmPrompt": null,
    "calculationData": null,
    "status": "pending",
    "createdAt": "2025-08-25T12:05:00.000Z",
    "scheduleTime": "2025-08-26T02:00:00.000Z",
    "comment": "Daily database backup"
  },
  {
    "taskId": 3,
    "task": "generate_reports",
    "instruction": "Generate daily sales reports",
    "parameters": {
      "reportType": "sales",
      "period": "daily"
    },
    "tools": null,
    "productId": null,
    "llmPrompt": null,
    "calculationData": null,
    "status": "pending",
    "createdAt": "2025-08-25T12:05:00.000Z",
    "scheduleTime": "2025-08-26T06:00:00.000Z",
    "comment": "Daily sales report generation"
  },
  {
    "taskId": 4,
    "task": "cleanup_logs",
    "instruction": "Clean up old log files",
    "parameters": {
      "retentionDays": 30
    },
    "tools": null,
    "productId": null,
    "llmPrompt": null,
    "calculationData": null,
    "status": "pending",
    "createdAt": "2025-08-25T12:05:00.000Z",
    "scheduleTime": "2025-08-26T03:00:00.000Z",
    "comment": "Weekly log cleanup"
  }
]
```

### 3. Get All Scheduler Tasks

**GET** `/scheduler`

Retrieves all scheduler tasks, ordered by creation date (newest first).

#### Response
```json
[
  {
    "taskId": 1,
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
    "status": "pending",
    "createdAt": "2025-08-25T12:00:00.000Z",
    "scheduleTime": "2025-08-26T10:30:00.000Z",
    "comment": "Monthly product analysis task"
  },
  {
    "taskId": 2,
    "task": "backup_database",
    "instruction": "Create a backup of the main database",
    "parameters": null,
    "tools": null,
    "productId": null,
    "llmPrompt": null,
    "calculationData": null,
    "status": "done",
    "createdAt": "2025-08-25T12:05:00.000Z",
    "scheduleTime": "2025-08-26T02:00:00.000Z",
    "comment": "Daily database backup"
  }
]
```

### 4. Get a Single Scheduler Task

**GET** `/scheduler/{id}`

Retrieves a specific scheduler task by its ID.

#### Path Parameters
- `id` (number): The ID of the scheduler task

#### Example Request
```
GET /scheduler/1
```

#### Response
```json
{
  "taskId": 1,
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
  "status": "pending",
  "createdAt": "2025-08-25T12:00:00.000Z",
  "scheduleTime": "2025-08-26T10:30:00.000Z",
  "comment": "Monthly product analysis task"
}
```

#### Error Response (404)
```json
{
  "statusCode": 404,
  "message": "Scheduler task with ID 999 not found",
  "error": "Not Found"
}
```

### 5. Update a Scheduler Task

**PATCH** `/scheduler/{id}`

Updates an existing scheduler task. Only provided fields will be updated.

#### Path Parameters
- `id` (number): The ID of the scheduler task

#### Request Body (Partial Update)
```json
{
  "status": "done",
  "comment": "Task completed successfully",
  "calculationData": {
    "revenue": 55000,
    "cost": 32000,
    "margin": 23000
  }
}
```

#### Response
```json
{
  "taskId": 1,
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
    "revenue": 55000,
    "cost": 32000,
    "margin": 23000
  },
  "status": "done",
  "createdAt": "2025-08-25T12:00:00.000Z",
  "scheduleTime": "2025-08-26T10:30:00.000Z",
  "comment": "Task completed successfully"
}
```

### 6. Delete a Scheduler Task

**DELETE** `/scheduler/{id}`

Deletes a scheduler task permanently.

#### Path Parameters
- `id` (number): The ID of the scheduler task

#### Response
- Status Code: `204 No Content`
- Body: Empty

#### Error Response (404)
```json
{
  "statusCode": 404,
  "message": "Scheduler task with ID 999 not found",
  "error": "Not Found"
}
```

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `taskId` | number | Auto-generated | Unique identifier for the task |
| `task` | string | Yes | Name or type of the task to be executed |
| `instruction` | string | No | Detailed instructions for task execution |
| `parameters` | object | No | Key-value pairs of parameters for the task |
| `tools` | string[] | No | Array of tool names required for the task |
| `productId` | string | No | Associated product identifier |
| `llmPrompt` | string | No | Prompt for LLM if AI processing is required |
| `calculationData` | object | No | Numeric data for calculations (key-value pairs) |
| `status` | enum | No | Task status: "pending" (default), "error", "done" |
| `createdAt` | datetime | Auto-generated | Timestamp when the task was created |
| `scheduleTime` | datetime | Yes | When the task should be executed |
| `comment` | string | Yes | Additional notes or comments about the task |

## Status Codes

- `200 OK` - Successful GET, PATCH operations
- `201 Created` - Successful POST operations
- `204 No Content` - Successful DELETE operations
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Error Handling

All errors follow a consistent format:

```json
{
  "statusCode": 404,
  "message": "Detailed error message",
  "error": "Error Type"
}
```

## Database Configuration

The scheduler uses MySQL database with the following connection details:
- **Host**: localhost
- **Port**: 3306
- **Database**: fuelai_db
- **Username**: pythonuser
- **Password**: dmc54321

The `schedulertasks` table will be automatically created when the application starts if it doesn't exist.
