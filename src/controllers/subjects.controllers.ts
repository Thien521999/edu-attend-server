import { NextFunction, Request, Response } from 'express'
import { SUBJECT_MESSAGES } from '~/constants/messages'
import subjectsService from '~/services/subjects.services'

export const createSubjectController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await subjectsService.createSubject(req.body)
  res.json({
    message: SUBJECT_MESSAGES.CREATE_SUBJECT_SUCCESS,
    result
  })
}

export const getSubjectsController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await subjectsService.getSubjects({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: SUBJECT_MESSAGES.GET_SUBJECTS_SUCCESS,
    result
  })
}

export const getSubjectDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await subjectsService.getSubjectDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: SUBJECT_MESSAGES.SUBJECT_NOT_FOUND
    })
    return
  }
  res.json({
    message: SUBJECT_MESSAGES.GET_SUBJECT_DETAIL_SUCCESS,
    result
  })
}

export const updateSubjectController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await subjectsService.updateSubject(id as string, req.body)
  res.json({
    message: SUBJECT_MESSAGES.UPDATE_SUBJECT_SUCCESS,
    result
  })
}

export const deleteSubjectController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await subjectsService.deleteSubject(id as string)
  res.json({
    message: SUBJECT_MESSAGES.DELETE_SUBJECT_SUCCESS,
    result
  })
}
