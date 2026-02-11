import { ParamsDictionary } from 'express-serve-static-core'

export interface CreateAcademicYearReqBody {
  name: string
  start_date: string // ISO date string
  end_date: string // ISO date string
  is_active: boolean
}

export interface UpdateAcademicYearReqBody {
  name?: string
  start_date?: string
  end_date?: string
  is_active?: boolean
}

export interface AcademicYearParams extends ParamsDictionary {
  id: string
}
