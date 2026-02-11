import { ParamsDictionary } from 'express-serve-static-core'

export interface CreateGradeReqBody {
  name: string
  level: number
}

export interface UpdateGradeReqBody {
  name?: string
  level?: number
}

export interface GradeParams extends ParamsDictionary {
  id: string
}
