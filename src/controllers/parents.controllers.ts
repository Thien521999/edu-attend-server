import { NextFunction, Request, Response } from 'express'
import { PARENT_MESSAGES, STUDENT_PARENT_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/User.requests'
import parentsService from '~/services/parents.services'

export const createParentController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await parentsService.createParent(user_id, req.body)
  res.json({
    message: PARENT_MESSAGES.CREATE_PARENT_SUCCESS,
    result
  })
}

export const getParentsController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await parentsService.getParents({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: PARENT_MESSAGES.GET_PARENTS_SUCCESS,
    result
  })
}

export const getParentDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await parentsService.getParentDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: PARENT_MESSAGES.PARENT_NOT_FOUND
    })
    return
  }
  res.json({
    message: PARENT_MESSAGES.GET_PARENT_DETAIL_SUCCESS,
    result
  })
}

export const updateParentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await parentsService.updateParent(id as string, req.body)
  res.json({
    message: PARENT_MESSAGES.UPDATE_PARENT_SUCCESS,
    result
  })
}

export const deleteParentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await parentsService.deleteParent(id as string)
  res.json({
    message: PARENT_MESSAGES.DELETE_PARENT_SUCCESS,
    result
  })
}

export const linkStudentController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await parentsService.linkToStudent(req.body)
  res.json({
    message: STUDENT_PARENT_MESSAGES.LINK_SUCCESS,
    result
  })
}

export const unlinkStudentController = async (req: Request, res: Response, next: NextFunction) => {
  const { parent_id, student_id } = req.params
  const result = await parentsService.unlinkFromStudent(student_id as string, parent_id as string)
  res.json({
    message: STUDENT_PARENT_MESSAGES.UNLINK_SUCCESS,
    result
  })
}

export const getLinkedStudentsController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await parentsService.getLinkedStudents(id as string)
  res.json({
    message: STUDENT_PARENT_MESSAGES.GET_STUDENTS_SUCCESS,
    result
  })
}
