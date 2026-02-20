import { Router } from 'express'
import {
  batchCreateAttendanceRecordsController,
  createAttendanceSessionController,
  getAttendanceSessionDetailController,
  getAttendanceSessionsController,
  getAttendanceReportController,
  updateAttendanceSessionController,
  deleteAttendanceSessionController
} from '~/controllers/attendances.controllers'
import {
  createAttendanceSessionValidator,
  updateAttendanceSessionValidator
} from '~/middlewares/attendances.middlewares'
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
 * Description: Create attendance session
 * Path: /sessions
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateAttendanceSessionReqBody
 */
attendancesRouter.post(
  '/sessions',
  accessTokenValidator,
  verifiedUserValidator,
  createAttendanceSessionValidator,
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

/**
 * Description: Get attendance report
 * Path: /report/:class_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { date: string }
 */
attendancesRouter.get(
  '/report/:class_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getAttendanceReportController)
)

/**
 * Description: Update attendance session
 * Path: /sessions/:id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateAttendanceSessionReqBody
 */
attendancesRouter.patch(
  '/sessions/:id',
  accessTokenValidator,
  verifiedUserValidator,
  updateAttendanceSessionValidator,
  wrapRequestHandler(updateAttendanceSessionController)
)

/**
 * Description: Delete attendance session
 * Path: /sessions/:id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
attendancesRouter.delete(
  '/sessions/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(deleteAttendanceSessionController)
)

export default attendancesRouter
