import { ParamsDictionary } from 'express-serve-static-core'

export interface CreateGradeReqBody {
  name: string
  level: number
  school_id: string
}

export interface UpdateGradeReqBody {
  name?: string
  level?: number
  school_id?: string
}

export interface GradeParams extends ParamsDictionary {
  id: string
}
