import { Router } from 'express'
import {
  createParentController,
  deleteParentController,
  getParentDetailController,
  getParentsController,
  updateParentController,
  getLinkedStudentsController,
  linkStudentController,
  unlinkStudentController
} from '~/controllers/parents.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const parentsRouter = Router()

/**
 * Description: Get all parents
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
parentsRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getParentsController))

/**
 * Description: Get parent detail
 * Path: /:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
parentsRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getParentDetailController))

/**
 * Description: Create parent
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateParentReqBody
 */
parentsRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(createParentController))

/**
 * Description: Update parent
 * Path: /:id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateParentReqBody
 */
parentsRouter.patch('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(updateParentController))

/**
 * Description: Delete parent
 * Path: /:id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
parentsRouter.delete('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(deleteParentController))

/**
 * Description: Get linked students
 * Path: /:id/students
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
parentsRouter.get(
  '/:id/students',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getLinkedStudentsController)
)

/**
 * Description: Link student to parent
 * Path: /link-student
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: LinkStudentParentReqBody
 */
parentsRouter.post(
  '/link-student',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(linkStudentController)
)

/**
 * Description: Unlink student from parent
 * Path: /unlink-student/:parent_id/:student_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
parentsRouter.delete(
  '/unlink-student/:parent_id/:student_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unlinkStudentController)
)

export default parentsRouter
