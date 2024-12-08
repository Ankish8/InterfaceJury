import Redis from 'ioredis'
import { StudentMarks } from '../types/dashboard'

// Initialize Redis client
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

// Type guard to check if object is StudentMarks
function isStudentMarks(obj: unknown): obj is StudentMarks {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  const requiredKeys: Array<keyof StudentMarks> = [
    'uiDesign',
    'userResearch',
    'prototype',
    'kitKatPoints',
    'total',
    'comment',
    'lastModified'
  ]

  return requiredKeys.every(key => 
    key in obj && 
    (key === 'comment' || key === 'lastModified' ? 
      typeof (obj as Record<string, unknown>)[key] === 'string' :
      typeof (obj as Record<string, unknown>)[key] === 'number')
  )
}

export async function getAllMarks(): Promise<Record<string, StudentMarks>> {
  try {
    const data = await redis.hgetall('marks')
    
    if (!data) {
      return {}
    }

    // Parse all string values back into objects
    const parsed = Object.entries(data).reduce((acc, [key, value]) => {
      try {
        const parsedValue = JSON.parse(value)
        if (isStudentMarks(parsedValue)) {
          acc[key] = parsedValue
        }
      } catch (e) {
        console.warn(`Failed to parse value for key ${key}:`, e)
      }
      return acc
    }, {} as Record<string, StudentMarks>)

    console.log('Parsed data:', parsed)
    return parsed
  } catch (error) {
    console.error('Redis hgetall error:', error)
    return {}
  }
}

export async function setMarks(studentId: string, marks: StudentMarks): Promise<void> {
  try {
    if (!isStudentMarks(marks)) {
      throw new Error('Invalid marks data')
    }
    
    await redis.hset('marks', studentId, JSON.stringify(marks))
  } catch (error) {
    console.error('Redis hset error:', error)
    throw error
  }
}

export async function getMarksByStudentId(studentId: string): Promise<StudentMarks | null> {
  try {
    const data = await redis.hget('marks', studentId)
    if (!data) {
      return null
    }
    
    const parsed = JSON.parse(data)
    if (isStudentMarks(parsed)) {
      return parsed
    }
    return null
  } catch (error) {
    console.error('Redis hget error:', error)
    return null
  }
}
