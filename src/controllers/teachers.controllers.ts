import { NextFunction, Request, Response } from 'express'
import { TEACHER_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.requests'
import teachersService from '~/services/teachers.services'

export const createTeacherController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await teachersService.createTeacher(user_id, req.body)
  res.json({
    message: TEACHER_MESSAGES.CREATE_TEACHER_SUCCESS,
    result
  })
}

export const getTeachersController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await teachersService.getTeachers({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: TEACHER_MESSAGES.GET_TEACHERS_SUCCESS,
    result
  })
}

export const getTeacherDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await teachersService.getTeacherDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: TEACHER_MESSAGES.TEACHER_NOT_FOUND
    })
    return
  }
  res.json({
    message: TEACHER_MESSAGES.GET_TEACHER_DETAIL_SUCCESS,
    result
  })
}

export const updateTeacherController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await teachersService.updateTeacher(id as string, req.body)
  res.json({
    message: TEACHER_MESSAGES.UPDATE_TEACHER_SUCCESS,
    result
  })
}

export const deleteTeacherController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await teachersService.deleteTeacher(id as string)
  res.json({
    message: TEACHER_MESSAGES.DELETE_TEACHER_SUCCESS,
    result
  })
}
