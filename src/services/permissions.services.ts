import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class PermissionsService {
  async getPermissions() {
    const permissions = await databaseService.permissions.find({}).toArray()
    return permissions
  }

  async getPermissionDetail(id: string) {
    const permission = await databaseService.permissions.findOne({ _id: new ObjectId(id) })
    return permission
  }
}

const permissionsService = new PermissionsService()
export default permissionsService
