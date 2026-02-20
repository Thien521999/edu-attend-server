import { Router } from 'express'
import {
  assignRoleController,
  getRoleDetailController,
  getRolesController,
  getUserRolesController,
  unassignRoleController
} from '~/controllers/roles.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const rolesRouter = Router()

/**
 * Description: Get all roles
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
rolesRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getRolesController))

/**
 * Description: Get role detail
 * Path: /:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
rolesRouter.get('/:id', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getRoleDetailController))

/**
 * Description: Assign role to user
 * Path: /assign
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: AssignRoleReqBody
 */
rolesRouter.post('/assign', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(assignRoleController))

/**
 * Description: Unassign role from user
 * Path: /unassign/:user_id/:role_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
rolesRouter.delete(
  '/unassign/:user_id/:role_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(unassignRoleController)
)

/**
 * Description: Get user roles
 * Path: /user/:user_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
rolesRouter.get(
  '/user/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getUserRolesController)
)

export default rolesRouter
