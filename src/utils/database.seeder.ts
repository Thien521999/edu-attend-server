import { ObjectId } from 'mongodb'
import { RoleCode, PermissionCode, PermissionModule } from '~/constants/enums'
import databaseService from '~/services/database.services'
import Role from '~/models/schemas/Role.schema'
import Permission from '~/models/schemas/Permission.schema'
import RolePermission from '~/models/schemas/RolePermission.schema'
import User from '~/models/schemas/User.schema'
import UserRole from '~/models/schemas/UserRole.schema'
import { RoleScopeType, userVerifyStatus } from '~/constants/enums'
import { hashPassword } from '~/utils/crypto'

export const seedDatabase = async () => {
  console.log('--- Starting Database Seeding ---')

  // 1. Seed Permissions
  const permissionsData = [
    { code: PermissionCode.STUDENT_VIEW, module: PermissionModule.STUDENT, description: 'View student information' },
    {
      code: PermissionCode.ATTENDANCE_MARK,
      module: PermissionModule.ATTENDANCE,
      description: 'Mark student attendance'
    },
    { code: PermissionCode.TUITION_MANAGE, module: PermissionModule.FINANCE, description: 'Manage tuition fees' }
  ]

  for (const item of permissionsData) {
    const existing = await databaseService.permissions.findOne({ code: item.code })
    if (!existing) {
      await databaseService.permissions.insertOne(new Permission(item))
      console.log(`+ Permission seeded: ${item.code}`)
    }
  }

  // 2. Seed Roles
  const rolesData = [
    { code: RoleCode.SUPER_ADMIN, description: 'System Super Administrator' },
    { code: RoleCode.TEACHER, description: 'Teacher / Class Manager' },
    { code: RoleCode.USER, description: 'Student / Parent' }
  ]

  const roleMap: Record<string, ObjectId> = {}

  for (const item of rolesData) {
    const existing = await databaseService.roles.findOne({ code: item.code })
    let roleId: ObjectId
    if (!existing) {
      const result = await databaseService.roles.insertOne(new Role(item))
      roleId = result.insertedId
      console.log(`+ Role seeded: ${item.code}`)
    } else {
      roleId = existing._id as ObjectId
    }
    roleMap[item.code] = roleId
  }

  // 3. Seed Role-Permissions (Mapping)
  // Teacher has STUDENT_VIEW and ATTENDANCE_MARK
  // Super Admin has everything

  const allPermissions = await databaseService.permissions.find().toArray()

  const rolePermissionMapping = [
    {
      roleCode: RoleCode.SUPER_ADMIN,
      permissionCodes: [PermissionCode.STUDENT_VIEW, PermissionCode.ATTENDANCE_MARK, PermissionCode.TUITION_MANAGE]
    },
    {
      roleCode: RoleCode.TEACHER,
      permissionCodes: [PermissionCode.STUDENT_VIEW, PermissionCode.ATTENDANCE_MARK]
    },
    {
      roleCode: RoleCode.USER,
      permissionCodes: [PermissionCode.STUDENT_VIEW]
    }
  ]

  for (const mapping of rolePermissionMapping) {
    const roleId = roleMap[mapping.roleCode]
    for (const pCode of mapping.permissionCodes) {
      const permission = allPermissions.find((p) => p.code === pCode)
      if (permission) {
        const existing = await databaseService.rolePermissions.findOne({
          role_id: roleId,
          permission_id: permission._id
        })
        if (!existing) {
          await databaseService.rolePermissions.insertOne(
            new RolePermission({
              role_id: roleId,
              permission_id: permission._id as ObjectId
            })
          )
          console.log(`+ Mapping seeded: ${mapping.roleCode} -> ${pCode}`)
        }
      }
    }
  }

  // 4. Seed Super Admin Account
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@eduattend.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'

  const existingAdmin = await databaseService.users.findOne({ email: adminEmail })
  if (!existingAdmin) {
    const adminId = new ObjectId()
    // Create User
    await databaseService.users.insertOne(
      new User({
        _id: adminId,
        name: 'Super Admin',
        email: adminEmail,
        password: hashPassword(adminPassword),
        status: userVerifyStatus.Verified
      })
    )

    // Assign Role
    const superAdminRole = roleMap[RoleCode.SUPER_ADMIN]
    await databaseService.userRoles.insertOne(
      new UserRole({
        user_id: adminId,
        role_id: superAdminRole,
        scope_type: RoleScopeType.SYSTEM,
        scope_id: null,
        granted_by: adminId,
        created_at: new Date()
      })
    )
    console.log(`+ Super Admin account created: ${adminEmail}`)
  }

  console.log('--- Database Seeding Completed ---')
}
