import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CLASSES_MESSAGES } from '~/constants/messages'
import { CreateClassReqBody, UpdateClassReqBody, ClassParams } from '~/models/requests/Class.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import classesService from '~/services/classes.services'

export const createClassController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await classesService.createClass(user_id, req.body)
  res.json({
    message: CLASSES_MESSAGES.CREATE_CLASS_SUCCESS,
    result
  })
}

export const getClassesController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id, role = '' } = req.decoded_authorization as TokenPayload
  const result = await classesService.getClasses(user_id, role)
  res.json({
    message: CLASSES_MESSAGES.GET_CLASSES_SUCCESS,
    result
  })
}

export const getClassDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as ClassParams
  const result = await classesService.getClassDetail(id)
  if (!result) {
    res.status(404).json({
      message: CLASSES_MESSAGES.CLASS_NOT_FOUND
    })
    return
  }
  res.json({
    message: CLASSES_MESSAGES.GET_CLASS_DETAIL_SUCCESS,
    result
  })
}

export const updateClassController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as ClassParams
  const result = await classesService.updateClass(id, req.body)
  res.json({
    message: CLASSES_MESSAGES.UPDATE_CLASS_SUCCESS,
    result
  })
}

export const deleteClassController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params as ClassParams
  const result = await classesService.deleteClass(id)
  res.json({
    message: CLASSES_MESSAGES.DELETE_CLASS_SUCCESS,
    result
  })
}
