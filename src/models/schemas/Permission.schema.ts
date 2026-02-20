import { ObjectId } from 'mongodb'
import { PermissionCode, PermissionModule } from '~/constants/enums'

interface PermissionType {
  _id?: ObjectId
  code: PermissionCode // 'STUDENT_VIEW' | 'ATTENDANCE_MARK' | 'TUITION_MANAGE'
  module: PermissionModule // 'STUDENT' | 'ATTENDANCE' | 'FINANCE' | 'TEACHER' | 'CLASS' | 'SUBJECT' | 'SCHEDULE' | 'GRADE' | 'REPORT' | 'SYSTEM'
  description: string
}

export default class Permission {
  _id?: ObjectId
  code: PermissionCode
  module: PermissionModule
  description: string

  constructor(permission: PermissionType) {
    this._id = permission._id
    this.code = permission.code
    this.module = permission.module
    this.description = permission.description
  }
}
