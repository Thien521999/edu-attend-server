import { Request, Response } from 'express'
import { SCHOOL_MESSAGES } from '~/constants/messages'
import schoolsService from '~/services/schools.services'
import { CreateSchoolReqBody, UpdateSchoolReqBody, SchoolParams } from '~/models/requests/School.requests'

export const createSchoolController = async (req: Request, res: Response) => {
  const result = await schoolsService.createSchool(req.body as CreateSchoolReqBody)
  res.json({
    message: SCHOOL_MESSAGES.CREATE_SCHOOL_SUCCESS,
    result
  })
}

export const getSchoolsController = async (req: Request, res: Response) => {
  const result = await schoolsService.getSchools()
  res.json({
    message: SCHOOL_MESSAGES.GET_SCHOOLS_SUCCESS,
    result
  })
}

export const getSchoolDetailController = async (req: Request, res: Response) => {
  const { id } = req.params as SchoolParams
  const result = await schoolsService.getSchoolDetail(id)
  if (!result) {
    res.status(404).json({
      message: SCHOOL_MESSAGES.SCHOOL_NOT_FOUND
    })
    return
  }
  res.json({
    message: SCHOOL_MESSAGES.GET_SCHOOL_DETAIL_SUCCESS,
    result
  })
}

export const updateSchoolController = async (req: Request, res: Response) => {
  const { id } = req.params as SchoolParams
  const result = await schoolsService.updateSchool(id, req.body as UpdateSchoolReqBody)
  if (!result) {
    res.status(404).json({
      message: SCHOOL_MESSAGES.SCHOOL_NOT_FOUND
    })
    return
  }
  res.json({
    message: SCHOOL_MESSAGES.UPDATE_SCHOOL_SUCCESS,
    result
  })
}

export const deleteSchoolController = async (req: Request, res: Response) => {
  const { id } = req.params as SchoolParams
  const result = await schoolsService.deleteSchool(id)
  res.json({
    message: SCHOOL_MESSAGES.DELETE_SCHOOL_SUCCESS,
    result
  })
}
