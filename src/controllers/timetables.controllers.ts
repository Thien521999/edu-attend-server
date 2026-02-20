import { NextFunction, Request, Response } from 'express'
import { TIMETABLE_MESSAGES } from '~/constants/messages'
import timetablesService from '~/services/timetables.services'

export const createTimetableController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await timetablesService.createTimetable(req.body)
  res.json({
    message: TIMETABLE_MESSAGES.CREATE_TIMETABLE_SUCCESS,
    result
  })
}

export const getTimetablesController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await timetablesService.getTimetables({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: TIMETABLE_MESSAGES.GET_TIMETABLES_SUCCESS,
    result
  })
}

export const getTimetableDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await timetablesService.getTimetableDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: TIMETABLE_MESSAGES.TIMETABLE_NOT_FOUND
    })
    return
  }
  res.json({
    message: TIMETABLE_MESSAGES.GET_TIMETABLE_DETAIL_SUCCESS,
    result
  })
}

export const updateTimetableController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await timetablesService.updateTimetable(id as string, req.body)
  res.json({
    message: TIMETABLE_MESSAGES.UPDATE_TIMETABLE_SUCCESS,
    result
  })
}

export const deleteTimetableController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await timetablesService.deleteTimetable(id as string)
  res.json({
    message: TIMETABLE_MESSAGES.DELETE_TIMETABLE_SUCCESS,
    result
  })
}
