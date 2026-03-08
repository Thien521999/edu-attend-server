import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import UserRole from '~/models/schemas/UserRole.schema'
import { AssignRoleReqBody } from '~/models/requests/RBAC.requests'
import redisService from './redis.services'

class RolesService {
  async getRoles() {
    const roles = await databaseService.roles.find({}).toArray()
    return roles
  }

  async getRoleDetail(id: string) {
    const role = await databaseService.roles.findOne({ _id: new ObjectId(id) })
    return role
  }

  async assignRoleToUser(payload: AssignRoleReqBody) {
    const result = await databaseService.userRoles.insertOne(
      new UserRole({
        user_id: new ObjectId(payload.user_id),
        role_id: new ObjectId(payload.role_id),
        scope_type: payload.scope_type,
        scope_id: payload.scope_id ? new ObjectId(payload.scope_id) : null,
        granted_by: new ObjectId(payload.user_id), // Placeholder for auditor, should ideally be the current user
        created_at: new Date()
      })
    )
    // Invalidate cache
    await redisService.del(`user:perms:${payload.user_id}`)
    return result
  }

  async unassignRoleFromUser(user_id: string, role_id: string) {
    const result = await databaseService.userRoles.deleteOne({
      user_id: new ObjectId(user_id),
      role_id: new ObjectId(role_id)
    })
    // Invalidate cache
    await redisService.del(`user:perms:${user_id}`)
    return result
  }

  async getUserRoles(user_id: string) {
    const userRoles = await databaseService.userRoles
      .aggregate([
        { $match: { user_id: new ObjectId(user_id) } },
        {
          $lookup: {
            from: 'roles', // Should use env or constant if possible
            localField: 'role_id',
            foreignField: '_id',
            as: 'role_info'
          }
        },
        { $unwind: '$role_info' }
      ])
      .toArray()
    return userRoles
  }
}

const rolesService = new RolesService()
export default rolesService
