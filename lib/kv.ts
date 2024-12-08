import Redis from 'ioredis'

const redis = new Redis('redis://default:YxHtdLqlYGLq7XjJlfCdwt2yblBHySK6@redis-19834.c239.us-east-1-2.ec2.redns.redis-cloud.com:19834')

// Add error handling
redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Connected to Redis')
})

const kv = {
  async hset(key: string, value: any) {
    return redis.hset(key, value)
  },
  async hgetall(key: string) {
    return redis.hgetall(key)
  },
  async hexists(key: string, field: string) {
    return redis.hexists(key, field)
  }
}

export { kv }
