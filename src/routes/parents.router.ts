import { Router } from 'express'
import {
  createParentController,
  deleteParentController,
  getParentDetailController,
  getParentsController,
  updateParentController
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

export default parentsRouter
