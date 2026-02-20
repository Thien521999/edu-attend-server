import { Router } from 'express'
import {
  createGradeController,
  getGradesController,
  getGradeDetailController,
  updateGradeController,
  deleteGradeController
} from '~/controllers/grades.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { roleValidator } from '~/middlewares/rbac.middlewares'
import { RoleCode } from '~/constants/enums'
import { createGradeValidator, updateGradeValidator, gradeIdValidator } from '~/middlewares/grades.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const gradesRouter = Router()

/**
 * Description: Get all grades
 * Path: /all
 * Method: GET
 */
gradesRouter.get('/all', wrapRequestHandler(getGradesController))

/**
 * Description: Get grade detail
 * Path: /:id
 * Method: GET
 */
gradesRouter.get('/:id', gradeIdValidator, wrapRequestHandler(getGradeDetailController))

/**
 * Description: Create a grade
 * Path: /
 * Method: POST
 */
gradesRouter.post(
  '/',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  createGradeValidator,
  wrapRequestHandler(createGradeController)
)

/**
 * Description: Update a grade
 * Path: /:id
 * Method: PATCH
 */
gradesRouter.patch(
  '/:id',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  gradeIdValidator,
  updateGradeValidator,
  wrapRequestHandler(updateGradeController)
)

/**
 * Description: Delete a grade
 * Path: /:id
 * Method: DELETE
 */
gradesRouter.delete(
  '/:id',
  accessTokenValidator,
  roleValidator(RoleCode.SUPER_ADMIN),
  gradeIdValidator,
  wrapRequestHandler(deleteGradeController)
)

export default gradesRouter
