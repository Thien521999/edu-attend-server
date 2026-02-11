import { Router } from 'express'
import { getRoleDetailController, getRolesController } from '~/controllers/roles.controllers'
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

export default rolesRouter
