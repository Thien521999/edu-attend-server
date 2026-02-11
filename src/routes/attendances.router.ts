import { Router } from 'express'
import {
  batchCreateAttendanceRecordsController,
  createAttendanceSessionController,
  getAttendanceSessionDetailController,
  getAttendanceSessionsController
} from '~/controllers/attendances.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const attendancesRouter = Router()

/**
 * Description: Get all sessions
 * Path: /sessions
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
attendancesRouter.get(
  '/sessions',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getAttendanceSessionsController)
)

/**
 * Description: Get session detail
 * Path: /sessions/:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
attendancesRouter.get(
  '/sessions/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getAttendanceSessionDetailController)
)

/**
 * Description: Create session
 * Path: /sessions
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateAttendanceSessionReqBody
 */
attendancesRouter.post(
  '/sessions',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(createAttendanceSessionController)
)

/**
 * Description: Batch mark attendance
 * Path: /records
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: BatchCreateAttendanceRecordsReqBody
 */
attendancesRouter.post(
  '/records',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(batchCreateAttendanceRecordsController)
)

export default attendancesRouter
