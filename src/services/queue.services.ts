import { Queue } from 'bullmq'
import { config } from 'dotenv'

config()

const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379')
}

// Create a new queue
export const emailQueue = new Queue('email', {
  connection: redisConnection
})

export const addEmailJob = async (data: {
  type: 'verify-register' | 'forgot-password'
  email: string
  token: string
}) => {
  await emailQueue.add(data.type, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000 // 5 seconds
    }
  })
}
