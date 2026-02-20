import { ParamsDictionary } from 'express-serve-static-core'

export interface CreateSchoolReqBody {
  name: string
  code: string
  address: string
  phone: string
  email: string
}

export interface UpdateSchoolReqBody {
  name?: string
  code?: string
  address?: string
  phone?: string
  email?: string
}

export interface SchoolParams extends ParamsDictionary {
  id: string
}
