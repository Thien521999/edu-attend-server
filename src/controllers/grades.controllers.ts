import { Request, Response, NextFunction } from 'express'
import { GRADE_MESSAGES } from '~/constants/messages'
import gradesService from '~/services/grades.services'
import { CreateGradeReqBody, UpdateGradeReqBody, GradeParams } from '~/models/requests/Grade.requests'

export const createGradeController = async (req: Request, res: Response) => {
  console.log({ body: req.body })

  const result = await gradesService.createGrade(req.body as CreateGradeReqBody)
  res.json({
    message: GRADE_MESSAGES.CREATE_GRADE_SUCCESS,
    result
  })
}

export const getGradesController = async (req: Request, res: Response) => {
  const result = await gradesService.getGrades()
  res.json({
    message: GRADE_MESSAGES.GET_GRADES_SUCCESS,
    result
  })
}

export const getGradeDetailController = async (req: Request, res: Response) => {
  const { id } = req.params as GradeParams
  const result = await gradesService.getGradeDetail(id)
  if (!result) {
    res.status(404).json({
      message: GRADE_MESSAGES.GRADE_NOT_FOUND
    })
    return
  }
  res.json({
    message: GRADE_MESSAGES.GET_GRADE_DETAIL_SUCCESS,
    result
  })
}

export const updateGradeController = async (req: Request, res: Response) => {
  const { id } = req.params as GradeParams
  const result = await gradesService.updateGrade(id, req.body as UpdateGradeReqBody)
  if (!result) {
    res.status(404).json({
      message: GRADE_MESSAGES.GRADE_NOT_FOUND
    })
    return
  }
  res.json({
    message: GRADE_MESSAGES.UPDATE_GRADE_SUCCESS,
    result
  })
}

export const deleteGradeController = async (req: Request, res: Response) => {
  const { id } = req.params as GradeParams
  const result = await gradesService.deleteGrade(id)
  res.json({
    message: GRADE_MESSAGES.DELETE_GRADE_SUCCESS,
    result
  })
}
