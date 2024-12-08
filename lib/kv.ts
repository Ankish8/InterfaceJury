import { createClient } from '@vercel/kv'

const kv = createClient({
  url: process.env.REDIS_URL || '',
})

export { kv }
