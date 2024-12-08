import Redis from 'ioredis'

const getRedisClient = () => {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL)
  }
  return new Redis('redis://default:YxHtdLqlYGLq7XjJlfCdwt2yblBHySK6@redis-19834.c239.us-east-1-2.ec2.redns.redis-cloud.com:19834')
}

const redis = getRedisClient()

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Connected to Redis')
})

const kv = {
  async hset(key: string, field: string, value: any) {
    try {
      return await redis.hset(key, field, value)
    } catch (error) {
      console.error('Redis hset error:', error)
      throw error
    }
  },
  async hgetall(key: string) {
    try {
      const data = await redis.hgetall(key)
      return Object.fromEntries(
        Object.entries(data || {}).map(([k, v]) => [k, JSON.parse(v)])
      )
    } catch (error) {
      console.error('Redis hgetall error:', error)
      return {}
    }
  },
  async hexists(key: string, field: string) {
    try {
      return await redis.hexists(key, field)
    } catch (error) {
      console.error('Redis hexists error:', error)
      return false
    }
  }
}

export { kv }
