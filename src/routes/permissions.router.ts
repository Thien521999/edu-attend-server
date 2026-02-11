import { Router } from 'express'
import { getPermissionDetailController, getPermissionsController } from '~/controllers/permissions.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const permissionsRouter = Router()

/**
 * Description: Get all permissions
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
permissionsRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getPermissionsController))

/**
 * Description: Get permission detail
 * Path: /:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
permissionsRouter.get(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getPermissionDetailController)
)

export default permissionsRouter
