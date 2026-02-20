import { NextFunction, Request, Response } from 'express'
import { STUDENT_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.requests'
import studentsService from '~/services/students.services'

export const createStudentController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await studentsService.createStudent(user_id, req.body)
  res.json({
    message: STUDENT_MESSAGES.CREATE_STUDENT_SUCCESS,
    result
  })
}

export const getStudentsController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await studentsService.getStudents({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: STUDENT_MESSAGES.GET_STUDENTS_SUCCESS,
    result
  })
}

export const getStudentDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await studentsService.getStudentDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: STUDENT_MESSAGES.STUDENT_NOT_FOUND
    })
    return
  }
  res.json({
    message: STUDENT_MESSAGES.GET_STUDENT_DETAIL_SUCCESS,
    result
  })
}

export const updateStudentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await studentsService.updateStudent(id as string, req.body)
  res.json({
    message: STUDENT_MESSAGES.UPDATE_STUDENT_SUCCESS,
    result
  })
}

export const deleteStudentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await studentsService.deleteStudent(id as string)
  res.json({
    message: STUDENT_MESSAGES.DELETE_STUDENT_SUCCESS,
    result
  })
}
