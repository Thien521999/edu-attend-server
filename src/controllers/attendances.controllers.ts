import { NextFunction, Request, Response } from 'express'
import { ATTENDANCE_MESSAGES } from '~/constants/messages'
import attendancesService from '~/services/attendances.services'

export const createAttendanceSessionController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await attendancesService.createSession(req.body)
  res.json({
    message: ATTENDANCE_MESSAGES.CREATE_SESSION_SUCCESS,
    result
  })
}

export const getAttendanceSessionsController = async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query
  const result = await attendancesService.getSessions({
    page: Number(page as string) || 1,
    limit: Number(limit as string) || 10
  })
  res.json({
    message: ATTENDANCE_MESSAGES.GET_SESSIONS_SUCCESS,
    result
  })
}

export const getAttendanceSessionDetailController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await attendancesService.getSessionDetail(id as string)
  if (!result) {
    res.status(404).json({
      message: ATTENDANCE_MESSAGES.SESSION_NOT_FOUND
    })
    return
  }
  res.json({
    message: ATTENDANCE_MESSAGES.GET_SESSION_DETAIL_SUCCESS,
    result
  })
}

export const batchCreateAttendanceRecordsController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await attendancesService.batchCreateRecords(req.body)
  res.json({
    message: ATTENDANCE_MESSAGES.MARK_ATTENDANCE_SUCCESS,
    result
  })
}
