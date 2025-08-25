# Celery-like Task Processing System

## Overview

This implementation integrates a Celery-like task processing system using Redis and Bull queues in the NestJS scheduler module. The system provides distributed task processing with multiple workers running in parallel.

## Architecture

### Components

1. **CronService**: Discovers pending tasks and sends them to the queue
2. **TaskQueueService**: Manages task queues and job submission
3. **TaskProcessor**: Worker that processes tasks from the queue
4. **Redis**: Message broker for queue storage
5. **Database**: Stores task definitions and status

### Flow

```
[Cron Job] → [Find Pending Tasks] → [Send to Queue] → [3 Workers Process in Parallel] → [Update DB Status]
```

## Key Features

### Multi-Worker Processing
- **3 concurrent workers** process tasks in parallel
- Each worker handles tasks independently
- Workers simulate 5-second processing time before marking tasks as DONE

### Task Processing Flow
1. **Cron Discovery**: Every minute, the cron job finds tasks due for processing
2. **Queue Submission**: Pending tasks are sent to Redis queue in bulk
3. **Worker Processing**: 3 workers pick up tasks and process them
4. **Status Update**: After 5-second delay, workers mark tasks as DONE in database

### Error Handling
- **Retry Logic**: Failed jobs retry up to 3 times with exponential backoff
- **Error Status**: Failed tasks are marked with ERROR status in database
- **Queue Management**: Automatic cleanup of old completed/failed jobs

## Configuration

### Redis Settings
```typescript
// In scheduler.module.ts
redis: {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
}
```

### Worker Settings
```typescript
// In task.processor.ts
@Process({
  name: 'process-task',
  concurrency: 3, // 3 workers processing tasks in parallel
})
```

### Job Settings
```typescript
// In task-queue.service.ts
{
  attempts: 3, // Retry failed jobs up to 3 times
  backoff: {
    type: 'exponential',
    delay: 2000, // Start with 2 second delay
  },
  removeOnComplete: 10, // Keep only last 10 completed jobs
  removeOnFail: 50, // Keep only last 50 failed jobs
}
```

## API Endpoints

### Queue Monitoring
- `GET /scheduler/queue/status` - Get current queue status
  - Returns: waiting, active, completed, failed job counts

### Task Management
- All existing scheduler endpoints continue to work
- Tasks are automatically processed through the queue system

## Environment Variables

```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

## Worker Processing Details

### Task Processing Simulation
Each worker:
1. Receives task from queue
2. Logs start of processing
3. Waits 5 seconds (simulating work)
4. Updates task status to DONE in database
5. Logs completion

### Parallel Processing
- 3 workers can process different tasks simultaneously
- Each worker handles one task at a time
- Queue distributes tasks among available workers

## Monitoring

### Queue Status
Monitor queue health via:
```bash
GET /scheduler/queue/status
```

Response:
```json
{
  "waiting": 5,    // Tasks waiting to be processed
  "active": 3,     // Tasks currently being processed
  "completed": 10, // Completed tasks
  "failed": 1      // Failed tasks
}
```

### Logs
Worker activity is logged with:
- Worker ID
- Task ID
- Processing start/completion
- Task details (type, product, tools)

## Production Considerations

1. **Redis High Availability**: Use Redis cluster or sentinel for production
2. **Worker Scaling**: Adjust concurrency based on server resources
3. **Monitoring**: Implement proper queue monitoring and alerting
4. **Error Handling**: Add more sophisticated error handling and retry logic
5. **Performance**: Monitor worker performance and adjust processing times

## Benefits

1. **Scalability**: Easy to scale workers up/down
2. **Reliability**: Automatic retries and error handling
3. **Monitoring**: Built-in queue status monitoring
4. **Performance**: Parallel processing of tasks
5. **Flexibility**: Easy to modify task processing logic
