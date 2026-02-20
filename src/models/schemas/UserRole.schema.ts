import { ObjectId } from 'mongodb'
import { RoleScopeType } from '~/constants/enums'

interface UserRoleType {
  _id?: ObjectId
  user_id: ObjectId
  role_id: ObjectId
  scope_type: RoleScopeType // 'SYSTEM' | 'CLASS' | 'STUDENT'
  scope_id: ObjectId | null // ID của Lớp hoặc Học sinh cụ thể
  granted_by: ObjectId // ID của người gán role (Super Admin hoặc Teacher)
  created_at: Date
}

export default class UserRole {
  _id?: ObjectId
  user_id: ObjectId
  role_id: ObjectId
  scope_type: RoleScopeType // 'SYSTEM' | 'CLASS' | 'STUDENT'
  scope_id: ObjectId | null // scope_id phụ thuộc vào scope_type
  granted_by: ObjectId // ID của người gán role (Super Admin hoặc Teacher)
  created_at: Date

  constructor(user: UserRoleType) {
    const date = new Date()
    this.user_id = user.user_id
    this.role_id = user.role_id
    this.scope_type = user.scope_type
    this.scope_id = user.scope_id || null
    this.granted_by = user.granted_by || null
    this.created_at = user.created_at || date
  }
}

// giải thích về scope_id
// scope_id phụ thuộc vào scope_type
