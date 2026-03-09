import { Worker, Job } from 'bullmq'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/utils/email'
import { config } from 'dotenv'

config()

const redisConnection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379')
}

export const initEmailWorker = () => {
  const worker = new Worker(
    'email',
    async (job: Job) => {
      const { type, email, token } = job.data

      console.log(`Processing email job: ${job.id} - Type: ${type} - To: ${email}`)

      if (type === 'verify-register') {
        await sendVerifyRegisterEmail(email, token)
      } else if (type === 'forgot-password') {
        await sendForgotPasswordEmail(email, token)
      }
    },
    {
      connection: redisConnection
    }
  )

  worker.on('completed', (job) => {
    console.log(`Email job completed: ${job.id}`)
  })

  worker.on('failed', (job, err) => {
    console.error(`Email job failed: ${job?.id} - Error: ${err.message}`)
  })

  console.log('Email worker initialized and waiting for jobs...')
}
