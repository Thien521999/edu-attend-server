import { Router } from 'express'
import { getAuditLogsController } from '~/controllers/auditLogs.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const auditLogsRouter = Router()

/**
 * Description: Get all audit logs
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
auditLogsRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getAuditLogsController))

export default auditLogsRouter
