import { Request, Response } from 'express'
import { ACADEMIC_YEAR_MESSAGES } from '~/constants/messages'
import academicYearsService from '~/services/academicYears.services'
import {
  CreateAcademicYearReqBody,
  UpdateAcademicYearReqBody,
  AcademicYearParams
} from '~/models/requests/AcademicYear.requests'

export const createAcademicYearController = async (req: Request, res: Response) => {
  const result = await academicYearsService.createAcademicYear(req.body as CreateAcademicYearReqBody)
  res.json({
    message: ACADEMIC_YEAR_MESSAGES.CREATE_ACADEMIC_YEAR_SUCCESS,
    result
  })
}

export const getAcademicYearsController = async (req: Request, res: Response) => {
  const { school_id } = req.query
  const result = await academicYearsService.getAcademicYears({
    school_id: school_id as string
  })
  res.json({
    message: ACADEMIC_YEAR_MESSAGES.GET_ACADEMIC_YEARS_SUCCESS,
    result
  })
}

export const getAcademicYearDetailController = async (req: Request, res: Response) => {
  const { id } = req.params as AcademicYearParams
  const result = await academicYearsService.getAcademicYearDetail(id)
  if (!result) {
    res.status(404).json({
      message: ACADEMIC_YEAR_MESSAGES.ACADEMIC_YEAR_NOT_FOUND
    })
    return
  }
  res.json({
    message: ACADEMIC_YEAR_MESSAGES.GET_ACADEMIC_YEAR_DETAIL_SUCCESS,
    result
  })
}

export const updateAcademicYearController = async (req: Request, res: Response) => {
  const { id } = req.params as AcademicYearParams
  const result = await academicYearsService.updateAcademicYear(id, req.body as UpdateAcademicYearReqBody)
  if (!result) {
    res.status(404).json({
      message: ACADEMIC_YEAR_MESSAGES.ACADEMIC_YEAR_NOT_FOUND
    })
    return
  }
  res.json({
    message: ACADEMIC_YEAR_MESSAGES.UPDATE_ACADEMIC_YEAR_SUCCESS,
    result
  })
}

export const deleteAcademicYearController = async (req: Request, res: Response) => {
  const { id } = req.params as AcademicYearParams
  const result = await academicYearsService.deleteAcademicYear(id)
  res.json({
    message: ACADEMIC_YEAR_MESSAGES.DELETE_ACADEMIC_YEAR_SUCCESS,
    result
  })
}
