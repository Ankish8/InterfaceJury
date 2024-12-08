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
  const url = process.env.REDIS_URL || 'redis://default:YxHtdLqlYGLq7XjJlfCdwt2yblBHySK6@redis-19834.c239.us-east-1-2.ec2.redns.redis-cloud.com:19834'
  console.log('Connecting to Redis at:', url.replace(/:[^:]*@/, ':***@'))
  return new Redis(url, {
    retryStrategy: (times) => {
      console.log(`Retry attempt ${times}`)
      return Math.min(times * 50, 2000)
    }
  })
}

const redis = getRedisClient()

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Connected to Redis successfully')
})

redis.on('ready', () => {
  console.log('Redis client is ready')
})

const kv = {
  async hset(key: string, field: string, value: string) {
    try {
      console.log('Setting Redis hash:', { key, field, valueLength: value.length })
      const result = await redis.hset(key, field, value)
      console.log('Redis hset result:', result)
      return result
    } catch (error) {
      console.error('Redis hset error:', error)
      throw error
    }
  },
  async hgetall(key: string): Promise<Record<string, StudentMarks>> {
    try {
      console.log('Getting all hash fields for key:', key)
      const data = await redis.hgetall(key)
      console.log('Raw Redis data:', data)
      const parsed = Object.fromEntries(
        Object.entries(data || {}).map(([k, v]) => {
          try {
            return [k, JSON.parse(v) as StudentMarks]
          } catch (e) {
            console.error('Failed to parse value for key:', k, 'Error:', e)
            return [k, null]
          }
        })
      )
      console.log('Parsed data:', parsed)
      return parsed
    } catch (error) {
      console.error('Redis hgetall error:', error)
      return {}
    }
  },
  async hexists(key: string, field: string): Promise<number> {
    try {
      console.log('Checking if hash exists:', { key, field })
      const result = await redis.hexists(key, field)
      console.log('Redis hexists result:', result)
      return result
    } catch (error) {
      console.error('Redis hexists error:', error)
      return 0
    }
  }
}

export { kv, type StudentMarks }
