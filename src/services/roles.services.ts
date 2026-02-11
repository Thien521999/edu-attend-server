import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class RolesService {
  async getRoles() {
    const roles = await databaseService.roles.find({}).toArray()
    return roles
  }

  async getRoleDetail(id: string) {
    const role = await databaseService.roles.findOne({ _id: new ObjectId(id) })
    return role
  }
}

const rolesService = new RolesService()
export default rolesService
