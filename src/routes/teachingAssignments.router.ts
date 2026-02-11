import { Router } from 'express'
import {
  createTeachingAssignmentController,
  deleteTeachingAssignmentController,
  getTeachingAssignmentDetailController,
  getTeachingAssignmentsController,
  updateTeachingAssignmentController
} from '~/controllers/teachingAssignments.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const teachingAssignmentsRouter = Router()

/**
 * Description: Get all assignments
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
teachingAssignmentsRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getTeachingAssignmentsController)
)

/**
 * Description: Get assignment detail
 * Path: /:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
teachingAssignmentsRouter.get(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getTeachingAssignmentDetailController)
)

/**
 * Description: Create assignment
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateTeachingAssignmentReqBody
 */
teachingAssignmentsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(createTeachingAssignmentController)
)

/**
 * Description: Update assignment
 * Path: /:id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateTeachingAssignmentReqBody
 */
teachingAssignmentsRouter.patch(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(updateTeachingAssignmentController)
)

/**
 * Description: Delete assignment
 * Path: /:id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
teachingAssignmentsRouter.delete(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(deleteTeachingAssignmentController)
)

export default teachingAssignmentsRouter
