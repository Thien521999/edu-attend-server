import { config } from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import Permission from '~/models/schemas/Permission.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Role from '~/models/schemas/Role.schema'
import RolePermission from '~/models/schemas/RolePermission.schema'
import User from '~/models/schemas/User.schema'
import UserRole from '~/models/schemas/UserRole.schema'
import Invitation from '~/models/schemas/Invitation.schema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@edu-attend-dev.yjtpovp.mongodb.net/?appName=edu-attend-dev`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('error??', error)
      throw error
    }
  }

  async indexUsers() {
    await Promise.all([
      this.users.createIndex({ email: 1, password: 1 }),
      this.users.createIndex({ email: 1 }, { unique: true })
    ])
  }

  async indexRefreshTokens() {
    await Promise.all([
      this.refreshToken.createIndex({ token: 1 }),
      this.refreshToken.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    ])
  }

  // async indexRBAC() {
  //   await Promise.all([
  //     this.roles.createIndex({ code: 1 }, { unique: true }),
  //     this.permissions.createIndex({ code: 1 }, { unique: true }),
  //     this.userRoles.createIndex({ user_id: 1 }),
  //     this.userRoles.createIndex({ role_id: 1 }),
  //     this.rolePermissions.createIndex({ role_id: 1, permission_id: 1 }, { unique: true }),
  //     this.invitations.createIndex({ email: 1 }),
  //     this.invitations.createIndex({ token: 1 })
  //   ])
  // }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get roles(): Collection<Role> {
    return this.db.collection(process.env.DB_ROLES_COLLECTION as string)
  }

  get permissions(): Collection<Permission> {
    return this.db.collection(process.env.DB_PERMISSIONS_COLLECTION as string)
  }

  get rolePermissions(): Collection<RolePermission> {
    return this.db.collection(process.env.DB_ROLE_PERMISSIONS_COLLECTION as string)
  }

  get userRoles(): Collection<UserRole> {
    return this.db.collection(process.env.DB_USER_ROLES_COLLECTION as string)
  }

  get invitations(): Collection<Invitation> {
    return this.db.collection(process.env.DB_INVITATIONS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
