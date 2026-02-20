import { ObjectId } from 'mongodb'
import { RoleScopeType } from '~/constants/enums'

export interface AssignRoleReqBody {
  user_id: string
  role_id: string
  scope_type: RoleScopeType
  scope_id?: string
}

export interface AssignPermissionReqBody {
  role_id: string
  permission_id: string
}
