import { Router } from 'express'
import {
  createClassController,
  getClassesController,
  getClassDetailController,
  updateClassController,
  deleteClassController
} from '~/controllers/classes.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { createClassValidator, updateClassValidator, classIdValidator } from '~/middlewares/classes.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const classesRouter = Router()

/**
 * Description: Create a class
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateClassReqBody
 */
classesRouter.post('/', accessTokenValidator, createClassValidator, wrapRequestHandler(createClassController))

/**
 * Description: Get all classes (filtered by owner if teacher)
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 * Query: {limit: number, page: number, name: string, code: string, academic_year_id: string}
 */
classesRouter.get('/', accessTokenValidator, wrapRequestHandler(getClassesController))

/**
 * Description: Get class detail
 * Path: /:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
classesRouter.get('/:id', accessTokenValidator, classIdValidator, wrapRequestHandler(getClassDetailController))

/**
 * Description: Update class
 * Path: /:id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateClassReqBody
 */
classesRouter.patch(
  '/:id',
  accessTokenValidator,
  classIdValidator,
  updateClassValidator,
  wrapRequestHandler(updateClassController)
)

/**
 * Description: Delete class
 * Path: /:id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
classesRouter.delete('/:id', accessTokenValidator, classIdValidator, wrapRequestHandler(deleteClassController))

export default classesRouter
