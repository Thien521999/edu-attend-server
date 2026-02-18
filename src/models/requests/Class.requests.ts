import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'

export interface CreateClassReqBody {
  name: string
  code: string
  link_code?: string
  grade_id: string
  school_id: string
  academic_year_id: string
}

export interface UpdateClassReqBody {
  name?: string
  code?: string
  link_code?: string
  grade_id?: string
  school_id?: string
  academic_year_id?: string
}

export interface ClassParams extends ParamsDictionary {
  id: string
}

export interface GetClassesQuery {
  name?: string
  code?: string
  academic_year_id?: string
  page?: string
  limit?: string
}
