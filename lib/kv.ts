import Redis from 'ioredis'

interface StudentMarks {
  uiDesign: number
  userResearch: number
  prototype: number
  kitKatPoints: number
  total: number
  comment: string
  lastModified: string
}

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
  async hset(key: string, field: string, value: string) {
    try {
      return await redis.hset(key, field, value)
    } catch (error) {
      console.error('Redis hset error:', error)
      throw error
    }
  },
  async hgetall(key: string): Promise<Record<string, StudentMarks>> {
    try {
      const data = await redis.hgetall(key)
      return Object.fromEntries(
        Object.entries(data || {}).map(([k, v]) => [k, JSON.parse(v) as StudentMarks])
      )
    } catch (error) {
      console.error('Redis hgetall error:', error)
      return {}
    }
  },
  async hexists(key: string, field: string): Promise<number> {
    try {
      return await redis.hexists(key, field)
    } catch (error) {
      console.error('Redis hexists error:', error)
      return 0
    }
  }
}

export { kv, type StudentMarks }
