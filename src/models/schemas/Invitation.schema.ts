import { ObjectId } from 'mongodb'
import { InvitationStatus, RoleScopeType } from '~/constants/enums'

interface InvitationType {
  _id?: ObjectId
  email: string
  role_id: ObjectId
  scope_type: RoleScopeType
  scope_id: ObjectId | null
  inviter_id: ObjectId // ID người gửi lời mời (Super Admin)
  token: string // token gửi qua email
  status: InvitationStatus // 'PENDING' | 'ACCEPTED' | 'EXPIRED'
  created_at?: Date
  expires_at?: Date
}

export default class Invitation {
  _id?: ObjectId
  email: string
  role_id: ObjectId
  scope_type: RoleScopeType
  scope_id: ObjectId | null
  inviter_id: ObjectId // ID người gửi lời mời (Super Admin)
  token: string // token gửi qua email
  status: InvitationStatus // 'PENDING' | 'ACCEPTED' | 'EXPIRED'
  created_at: Date
  expires_at: Date

  constructor(role: InvitationType) {
    const date = new Date()
    this._id = role._id
    this.email = role.email
    this.role_id = role.role_id
    this.scope_type = role.scope_type
    this.scope_id = role.scope_id
    this.inviter_id = role.inviter_id
    this.token = role.token
    this.status = role.status
    this.created_at = role.created_at || date
    this.expires_at = role.expires_at || date
  }
}
