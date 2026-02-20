import { Router } from 'express'
import {
  createStudentController,
  deleteStudentController,
  getStudentDetailController,
  getStudentsController,
  updateStudentController
} from '~/controllers/students.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const studentsRouter = Router()

/**
 * Description: Get all students
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
studentsRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getStudentsController))

/**
 * Description: Get student detail
 * Path: /:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
studentsRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getStudentDetailController))

/**
 * Description: Create student
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateStudentReqBody
 */
studentsRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(createStudentController))

/**
 * Description: Update student
 * Path: /:id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateStudentReqBody
 */
studentsRouter.patch('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(updateStudentController))

/**
 * Description: Delete student
 * Path: /:id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
studentsRouter.delete('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(deleteStudentController))

export default studentsRouter
