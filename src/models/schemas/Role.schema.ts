import { ObjectId } from 'mongodb'
import { RoleCode } from '~/constants/enums'

interface RoleType {
  _id?: ObjectId
  code: RoleCode
  description: string
}

export default class Role {
  _id?: ObjectId
  code: RoleCode // 'SUPER_ADMIN' | 'TEACHER' | 'USER'
  description: string

  constructor(role: RoleType) {
    this._id = role._id
    this.code = role.code
    this.description = role.description
  }
}
