import { Router } from 'express'
import {
  createSchoolController,
  getSchoolsController,
  getSchoolDetailController,
  updateSchoolController,
  deleteSchoolController
} from '~/controllers/schools.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { roleValidator } from '~/middlewares/rbac.middlewares'
import { RoleCode } from '~/constants/enums'
import { createSchoolValidator, updateSchoolValidator, schoolIdValidator } from '~/middlewares/schools.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const schoolsRouter = Router()

/**
 * Description: Get all schools
 * Path: /
 * Method: GET
 */
schoolsRouter.get('/', wrapRequestHandler(getSchoolsController))

/**
 * Description: Get school detail
 * Path: /:id
 * Method: GET
 */
schoolsRouter.get('/:id', schoolIdValidator, wrapRequestHandler(getSchoolDetailController))

/**
 * Description: Create a school
 * Path: /
 * Method: POST
 */
schoolsRouter.post(
  '/',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  createSchoolValidator,
  wrapRequestHandler(createSchoolController)
)

/**
 * Description: Update a school
 * Path: /:id
 * Method: PATCH
 */
schoolsRouter.patch(
  '/:id',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  schoolIdValidator,
  updateSchoolValidator,
  wrapRequestHandler(updateSchoolController)
)

/**
 * Description: Delete a school
 * Path: /:id
 * Method: DELETE
 */
schoolsRouter.delete(
  '/:id',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  schoolIdValidator,
  wrapRequestHandler(deleteSchoolController)
)

export default schoolsRouter
