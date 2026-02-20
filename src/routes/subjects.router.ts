import { Router } from 'express'
import {
  createSubjectController,
  deleteSubjectController,
  getSubjectDetailController,
  getSubjectsController,
  updateSubjectController
} from '~/controllers/subjects.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const subjectsRouter = Router()

/**
 * Description: Get all subjects
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
subjectsRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getSubjectsController))

/**
 * Description: Get subject detail
 * Path: /:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
subjectsRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getSubjectDetailController))

/**
 * Description: Create subject
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateSubjectReqBody
 */
subjectsRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(createSubjectController))

/**
 * Description: Update subject
 * Path: /:id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateSubjectReqBody
 */
subjectsRouter.patch('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(updateSubjectController))

/**
 * Description: Delete subject
 * Path: /:id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
subjectsRouter.delete('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(deleteSubjectController))

export default subjectsRouter
