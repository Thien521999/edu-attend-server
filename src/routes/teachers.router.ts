import { Router } from 'express'
import {
  createTeacherController,
  deleteTeacherController,
  getTeacherDetailController,
  getTeachersController,
  updateTeacherController
} from '~/controllers/teachers.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const teachersRouter = Router()

/**
 * Description: Get all teachers
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
teachersRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getTeachersController))

/**
 * Description: Get teacher detail
 * Path: /:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
teachersRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getTeacherDetailController))

/**
 * Description: Create teacher
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateTeacherReqBody
 */
teachersRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(createTeacherController))

/**
 * Description: Update teacher
 * Path: /:id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateTeacherReqBody
 */
teachersRouter.patch('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(updateTeacherController))

/**
 * Description: Delete teacher
 * Path: /:id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
teachersRouter.delete('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(deleteTeacherController))

export default teachersRouter
