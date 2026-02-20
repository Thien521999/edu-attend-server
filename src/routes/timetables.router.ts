import { Router } from 'express'
import {
  createTimetableController,
  deleteTimetableController,
  getTimetableDetailController,
  getTimetablesController,
  updateTimetableController
} from '~/controllers/timetables.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const timetablesRouter = Router()

/**
 * Description: Get all timetables
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
timetablesRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(getTimetablesController))

/**
 * Description: Get timetable detail
 * Path: /:id
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
timetablesRouter.get(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getTimetableDetailController)
)

/**
 * Description: Create timetable
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: CreateTimetableReqBody
 */
timetablesRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(createTimetableController))

/**
 * Description: Update timetable
 * Path: /:id
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UpdateTimetableReqBody
 */
timetablesRouter.patch(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(updateTimetableController)
)

/**
 * Description: Delete timetable
 * Path: /:id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 */
timetablesRouter.delete(
  '/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(deleteTimetableController)
)

export default timetablesRouter
