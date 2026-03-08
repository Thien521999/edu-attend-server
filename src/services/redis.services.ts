import { createClient, RedisClientType } from 'redis'
import { config } from 'dotenv'

config()

class RedisService {
  private client: RedisClientType

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    })

    this.client.on('error', (err) => console.log('Redis Client Error:', err))
  }

  async connect() {
    try {
      await this.client.connect()
      console.log('Successfully connected to Redis!')
    } catch (error) {
      console.log('Connect Redis error', error)
    }
  }

  async set(key: string, value: string, expirationInSeconds?: number) {
    if (expirationInSeconds) {
      await this.client.set(key, value, {
        EX: expirationInSeconds
      })
    } else {
      await this.client.set(key, value)
    }
  }

  async get(key: string) {
    return await this.client.get(key)
  }

  async del(key: string) {
    await this.client.del(key)
  }

  async quit() {
    await this.client.quit()
  }
}

const redisService = new RedisService()
export default redisService
