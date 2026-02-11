import { NextFunction, Request, Response } from 'express'
import { TEACHING_ASSIGNMENT_MESSAGES } from '~/constants/messages'
import teachingAssignmentsService from '~/services/teachingAssignments.services'

export const createTeachingAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await teachingAssignmentsService.createTeachingAssignment(req.body)
  res.json({
    message: TEACHING_ASSIGNMENT_MESSAGES.CREATE_ASSIGNMENT_SUCCESS,
    result
  })
}

export const getTeachingAssignmentsController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await teachingAssignmentsService.getTeachingAssignments({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: TEACHING_ASSIGNMENT_MESSAGES.GET_ASSIGNMENTS_SUCCESS,
    result
  })
}

export const getTeachingAssignmentDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await teachingAssignmentsService.getTeachingAssignmentDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: TEACHING_ASSIGNMENT_MESSAGES.ASSIGNMENT_NOT_FOUND
    })
    return
  }
  res.json({
    message: TEACHING_ASSIGNMENT_MESSAGES.GET_ASSIGNMENT_DETAIL_SUCCESS,
    result
  })
}

export const updateTeachingAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await teachingAssignmentsService.updateTeachingAssignment(id as string, req.body)
  res.json({
    message: TEACHING_ASSIGNMENT_MESSAGES.UPDATE_ASSIGNMENT_SUCCESS,
    result
  })
}

export const deleteTeachingAssignmentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await teachingAssignmentsService.deleteTeachingAssignment(id as string)
  res.json({
    message: TEACHING_ASSIGNMENT_MESSAGES.DELETE_ASSIGNMENT_SUCCESS,
    result
  })
}
