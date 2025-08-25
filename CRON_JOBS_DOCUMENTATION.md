# Scheduler Cron Jobs Documentation

This document describes the automated cron jobs implemented for the scheduler system.

## Overview

The scheduler system now includes automated cron jobs that handle task creation and processing. These jobs run in the background to maintain a continuous flow of tasks and ensure timely processing.

## Cron Jobs

### 1. Random Task Generator Cron Job

**Schedule**: Every 3 minutes (`0 */3 * * * *`)
**Function**: `addRandomTasks()`
**Purpose**: Automatically creates 6 random tasks with sequential schedule times

#### How it works:
- Runs every 3 minutes
- Creates 6 random tasks from predefined templates
- Schedule times are sequential starting from 1 minute after the cron job runs
- For example, if the cron runs at 10:00 AM, it creates tasks scheduled for:
  - 10:01 AM
  - 10:02 AM
  - 10:03 AM
  - 10:04 AM
  - 10:05 AM
  - 10:06 AM

#### Task Templates:
The cron job randomly selects from these task types:
- `process_product_data` - Product data processing
- `analyze_sales_trends` - Sales trend analysis
- `update_inventory` - Inventory management
- `generate_reports` - Report generation
- `data_cleanup` - Data maintenance
- `backup_database` - Database backup
- `send_notifications` - Notification delivery
- `calculate_metrics` - Business metrics calculation

### 2. Pending Task Processor Cron Job

**Schedule**: Every minute (`* * * * *`)
**Function**: `processPendingTasks()`
**Purpose**: Checks for pending tasks and marks them as done when their schedule time arrives

#### How it works:
- Runs every minute
- Finds all tasks with status "pending" whose `scheduleTime` is now or in the past
- Updates their status from "pending" to "done"
- Logs details of processed tasks

### 3. Cleanup Cron Job

**Schedule**: Daily at midnight (`0 0 * * *`)
**Function**: `cleanupOldTasks()`
**Purpose**: Removes old completed tasks to prevent database bloat

#### How it works:
- Runs once daily at midnight
- Deletes tasks older than 30 days that have status "done"
- Logs the number of cleaned up tasks

## API Endpoints for Monitoring

Several new endpoints have been added to monitor the cron job activities:

### Get Tasks by Status
```
GET /scheduler/status/{status}
```
Retrieves all tasks with a specific status (pending, done, error).

### Get Pending Tasks Due
```
GET /scheduler/monitoring/pending-due
```
Returns all pending tasks whose schedule time has passed.

### Get Task Statistics
```
GET /scheduler/monitoring/stats
```
Returns statistics about tasks grouped by status:
```json
{
  "pending": 15,
  "done": 243,
  "error": 2,
  "total": 260
}
```

### Bulk Update Status
```
PATCH /scheduler/bulk-update-status
```
Updates the status of multiple tasks at once:
```json
{
  "taskIds": [1, 2, 3],
  "status": "done"
}
```

## Database Schema

The scheduler uses the existing `SchedulerTask` entity with the following relevant fields:
- `taskId`: Unique identifier
- `task`: Task name/type
- `status`: pending | done | error
- `scheduleTime`: When the task should be executed
- `createdAt`: When the task was created

## Logging

All cron jobs include comprehensive logging:
- Start/completion messages
- Number of tasks processed
- Error handling and reporting
- Detailed task information

## Configuration

The cron jobs are configured in `/src/scheduler/cron.service.ts` and can be modified by changing the cron expressions:

- Random task generation: `'0 */3 * * * *'` (every 3 minutes)
- Pending task processing: `CronExpression.EVERY_MINUTE`
- Cleanup: `'0 0 * * *'` (daily at midnight)

## Testing

To test the cron jobs:

1. Start the application: `npm run start:dev`
2. Monitor the logs for cron job execution
3. Use the monitoring endpoints to check task creation and processing
4. Check the database to verify task creation and status updates

## Notes

- The random task generator creates realistic test data with varied parameters
- Tasks are automatically marked as "done" when their schedule time arrives
- Old completed tasks are automatically cleaned up to maintain performance
- All operations are logged for monitoring and debugging
