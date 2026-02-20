import { Router } from 'express'
import {
  assignPermissionController,
  getPermissionDetailController,
  getPermissionsController,
  getRolePermissionsController,
  unassignPermissionController
} from '~/controllers/permissions.controllers'
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

/**
 * Description: Assign permission to role
 * Path: /assign
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: AssignPermissionReqBody
 */
permissionsRouter.post(
  '/assign',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(assignPermissionController)
)

/**
 * Description: Unassign permission from role
 * Path: /unassign/:role_id/:permission_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
permissionsRouter.delete(
  '/unassign/:role_id/:permission_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unassignPermissionController)
)

/**
 * Description: Get role permissions
 * Path: /role/:role_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
permissionsRouter.get(
  '/role/:role_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getRolePermissionsController)
)

export default permissionsRouter
