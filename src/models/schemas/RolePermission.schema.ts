import { ObjectId } from 'mongodb'

interface RolePermissionType {
  _id?: ObjectId
  role_id: ObjectId
  permission_id: ObjectId
}

export default class RolePermission {
  _id?: ObjectId
  role_id: ObjectId
  permission_id: ObjectId

  constructor(user: RolePermissionType) {
    this._id = user._id
    this.role_id = user.role_id
    this.permission_id = user.permission_id
  }
}
