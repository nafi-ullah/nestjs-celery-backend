# Redis Configuration Options

## Current Fix Applied
The scheduler module now uses the same Redis configuration as the app module:
- Host: 127.0.0.1
- Port: 6379
- Password: 'redispass'

## Alternative Options

### Option 1: Remove Redis Authentication (Development)
If you want to remove Redis authentication for development, update both configurations:

```typescript
// In app.module.ts and scheduler.module.ts
redis: {
  host: '127.0.0.1',
  port: 6379,
  // Remove password line
},
```

And in your Redis server, disable authentication:
```bash
# In redis.conf, comment out or remove:
# requirepass redispass
```

### Option 2: Use Environment Variables (Recommended for Production)
Set environment variables and update both modules:

```bash
# .env file
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=redispass
```

```typescript
// In both app.module.ts and scheduler.module.ts
redis: {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
},
```

### Option 3: Current Redis Server Check
Verify your Redis server authentication:

```bash
# Connect to Redis CLI
redis-cli -h 127.0.0.1 -p 6379

# If it requires password:
redis-cli -h 127.0.0.1 -p 6379 -a redispass

# Check if auth is required:
redis-cli -h 127.0.0.1 -p 6379 ping
```

The current fix should resolve the authentication error by ensuring both the app module and scheduler module use the same Redis credentials.
