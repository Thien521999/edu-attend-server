import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import RolePermission from '~/models/schemas/RolePermission.schema'
import { AssignPermissionReqBody } from '~/models/requests/RBAC.requests'

class PermissionsService {
  async getPermissions() {
    const permissions = await databaseService.permissions.find({}).toArray()
    return permissions
  }

  async getPermissionDetail(id: string) {
    const permission = await databaseService.permissions.findOne({ _id: new ObjectId(id) })
    return permission
  }

  async assignPermissionToRole(payload: AssignPermissionReqBody) {
    const result = await databaseService.rolePermissions.insertOne(
      new RolePermission({
        role_id: new ObjectId(payload.role_id),
        permission_id: new ObjectId(payload.permission_id)
      })
    )
    return result
  }

  async unassignPermissionFromRole(role_id: string, permission_id: string) {
    const result = await databaseService.rolePermissions.deleteOne({
      role_id: new ObjectId(role_id),
      permission_id: new ObjectId(permission_id)
    })
    return result
  }

  async getRolePermissions(role_id: string) {
    const permissions = await databaseService.rolePermissions
      .aggregate([
        { $match: { role_id: new ObjectId(role_id) } },
        {
          $lookup: {
            from: 'permissions',
            localField: 'permission_id',
            foreignField: '_id',
            as: 'permission_info'
          }
        },
        { $unwind: '$permission_info' }
      ])
      .toArray()
    return permissions
  }
}

const permissionsService = new PermissionsService()
export default permissionsService
