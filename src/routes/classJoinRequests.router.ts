import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/handlers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import {
  approveJoinRequestController,
  createJoinRequestController,
  getJoinRequestsByClassController,
  getMyJoinRequestsController,
  rejectJoinRequestController
} from '~/controllers/classJoinRequests.controllers'
import { createJoinRequestValidator, rejectJoinRequestValidator } from '~/middlewares/classJoinRequests.middlewares'

const classJoinRequestsRouter = Router()

/**
 * Description: Student submits join request
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { link_code: string, full_name: string, student_code?: string }
 */
classJoinRequestsRouter.post(
  '/',
  accessTokenValidator,
  createJoinRequestValidator,
  wrapRequestHandler(createJoinRequestController)
)

/**
 * Description: Get my join requests (Student)
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
classJoinRequestsRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMyJoinRequestsController))

/**
 * Description: Get join requests for a class (Teacher)
 * Path: /class/:class_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: { status?: string, page?: number, limit?: number }
 */
classJoinRequestsRouter.get(
  '/class/:class_id',
  accessTokenValidator,
  wrapRequestHandler(getJoinRequestsByClassController)
)

/**
 * Description: Approve join request (Teacher)
 * Path: /:request_id/approve
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 */
classJoinRequestsRouter.post(
  '/:request_id/approve',
  accessTokenValidator,
  wrapRequestHandler(approveJoinRequestController)
)

/**
 * Description: Reject join request (Teacher)
 * Path: /:request_id/reject
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { reason?: string }
 */
classJoinRequestsRouter.post(
  '/:request_id/reject',
  accessTokenValidator,
  rejectJoinRequestValidator,
  wrapRequestHandler(rejectJoinRequestController)
)

export default classJoinRequestsRouter
