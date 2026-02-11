import { NextFunction, Request, Response } from 'express'
import { AUDIT_MESSAGES } from '~/constants/messages'
import auditLogsService from '~/services/auditLogs.services'

export const getAuditLogsController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await auditLogsService.getAuditLogs({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: AUDIT_MESSAGES.GET_LOGS_SUCCESS,
    result
  })
}
