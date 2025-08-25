#!/bin/bash

# Celery Integration Test Script
# This script demonstrates the new Celery-like task processing system

echo "🚀 Celery Integration Test Script"
echo "================================="

# Start the application
echo "📝 Starting NestJS application..."
echo "Make sure Redis is running on localhost:6379"
echo ""

# Wait for user confirmation
read -p "Press Enter to continue when Redis is running and app is started..."

echo ""
echo "🔍 Testing the Celery integration:"
echo ""

# Test 1: Check queue status
echo "1. Checking initial queue status:"
curl -s -X GET http://localhost:3000/scheduler/queue/status | jq .
echo ""

# Test 2: Create some test tasks
echo "2. Creating test tasks..."
curl -s -X POST http://localhost:3000/scheduler/multiple \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": [
      {
        "task": "test_task_1",
        "instruction": "Test task for Celery integration",
        "comment": "Test task 1",
        "scheduleTime": "'$(date -d '+1 minute' -Iseconds)'",
        "tools": ["calculator"],
        "parameters": {"test": true}
      },
      {
        "task": "test_task_2", 
        "instruction": "Another test task for Celery integration",
        "comment": "Test task 2",
        "scheduleTime": "'$(date -d '+1 minute' -Iseconds)'",
        "tools": ["data-processor"],
        "parameters": {"test": true}
      }
    ]
  }' | jq .
echo ""

# Test 3: Check pending tasks
echo "3. Checking pending tasks:"
curl -s -X GET http://localhost:3000/scheduler/status/pending | jq .
echo ""

# Test 4: Wait for cron to process tasks
echo "4. Waiting for cron job to pick up tasks (wait ~1-2 minutes)..."
echo "   Monitor the application logs to see:"
echo "   - Cron job finding pending tasks"
echo "   - Tasks being sent to queue" 
echo "   - 3 workers processing tasks in parallel"
echo "   - Tasks being marked as DONE after 5 seconds"
echo ""

read -p "Press Enter after observing the processing in logs..."

# Test 5: Check queue status after processing
echo "5. Checking queue status after processing:"
curl -s -X GET http://localhost:3000/scheduler/queue/status | jq .
echo ""

# Test 6: Check completed tasks
echo "6. Checking completed tasks:"
curl -s -X GET http://localhost:3000/scheduler/status/done | jq .
echo ""

echo "✅ Celery integration test completed!"
echo ""
echo "📊 Summary of what happened:"
echo "- Tasks were created with future schedule times"
echo "- Cron job (every minute) found pending tasks due for processing"
echo "- Tasks were sent to Redis queue in bulk"
echo "- 3 workers processed tasks in parallel"
echo "- Each worker waited 5 seconds before marking task as DONE"
echo "- Task status was updated in database"
echo ""
echo "🔗 Monitor endpoints:"
echo "- Queue Status: GET /scheduler/queue/status"
echo "- Task Stats: GET /scheduler/monitoring/stats"
echo "- Pending Tasks: GET /scheduler/status/pending"
echo "- Done Tasks: GET /scheduler/status/done"
