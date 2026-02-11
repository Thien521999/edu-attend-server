import { Router } from 'express'
import {
  createAcademicYearController,
  getAcademicYearsController,
  getAcademicYearDetailController,
  updateAcademicYearController,
  deleteAcademicYearController
} from '~/controllers/academicYears.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { roleValidator } from '~/middlewares/rbac.middlewares'
import { RoleCode } from '~/constants/enums'
import {
  createAcademicYearValidator,
  updateAcademicYearValidator,
  academicYearIdValidator
} from '~/middlewares/academicYears.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const academicYearsRouter = Router()

/**
 * Description: Get all academic years
 * Path: /
 * Method: GET
 */
academicYearsRouter.get('/', wrapRequestHandler(getAcademicYearsController))

/**
 * Description: Get academic year detail
 * Path: /:id
 * Method: GET
 */
academicYearsRouter.get('/:id', academicYearIdValidator, wrapRequestHandler(getAcademicYearDetailController))

/**
 * Description: Create an academic year
 * Path: /
 * Method: POST
 */
academicYearsRouter.post(
  '/',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  createAcademicYearValidator,
  wrapRequestHandler(createAcademicYearController)
)

/**
 * Description: Update an academic year
 * Path: /:id
 * Method: PATCH
 */
academicYearsRouter.patch(
  '/:id',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  academicYearIdValidator,
  updateAcademicYearValidator,
  wrapRequestHandler(updateAcademicYearController)
)

/**
 * Description: Delete an academic year
 * Path: /:id
 * Method: DELETE
 */
academicYearsRouter.delete(
  '/:id',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  academicYearIdValidator,
  wrapRequestHandler(deleteAcademicYearController)
)

export default academicYearsRouter
