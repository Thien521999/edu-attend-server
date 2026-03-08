import { NextFunction, Request, Response } from 'express'
import redisService from '~/services/redis.services'

export const rateLimitMiddleware = ({
  limit,
  windowInSeconds,
  keyPrefix = 'rate-limit'
}: {
  limit: number
  windowInSeconds: number
  keyPrefix?: string
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const key = `${keyPrefix}:${ip}`

    try {
      const current = await redisService.incr(key)

      if (current === 1) {
        // First request in the window, set expiration
        await redisService.expire(key, windowInSeconds)
      }

      if (current > limit) {
        return res.status(429).json({
          message: 'Too many requests, please try again later.',
          limit,
          windowInSeconds
        })
      }

      next()
    } catch (error) {
      console.error('Rate limit middleware error:', error)
      // Fail open to avoid blocking users if Redis is down
      next()
    }
  }
}
