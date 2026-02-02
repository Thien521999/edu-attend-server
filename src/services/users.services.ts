import { ObjectId } from 'mongodb'
import { TokenType, userVerifyStatus } from '~/constants/enums'
import { USERS_MESSAGES } from '~/constants/messages'
import { RegisterReqBody, UpdatedMeReqBody, TokenPayload } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'
import databaseService from './database.services'
import { signToken, verifyToken } from '~/utils/jwt'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { RoleCode, RoleScopeType, PermissionCode } from '~/constants/enums'
import { SignOptions } from 'jsonwebtoken'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/utils/email'
import { InvitationStatus } from '~/constants/enums'
import Invitation from '~/models/schemas/Invitation.schema'
import { AcceptInvitationReqBody } from '~/models/requests/Invitation.requests'
import UserRole from '~/models/schemas/UserRole.schema'

class UsersService {
  private signAccessToken({
    user_id,
    status,
    role,
    permissions,
    owner_id
  }: {
    user_id: string
    status: userVerifyStatus
    role?: string
    permissions?: string[]
    owner_id?: string
  }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        status,
        role,
        permissions,
        owner_id
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    })
  }

  private signRefreshsToken({
    user_id,
    status,
    role,
    permissions,
    owner_id,
    exp
  }: {
    user_id: string
    status: userVerifyStatus
    role?: string
    permissions?: string[]
    owner_id?: string
    exp?: number
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          status,
          role,
          permissions,
          owner_id,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        status,
        role,
        permissions,
        owner_id
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    })
  }

  private signEmailVerifyToken({ user_id, status }: { user_id: string; status: userVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.EmailVerifyToken,
        status
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    })
  }

  private signForgotPasswordToken({ user_id, status }: { user_id: string; status: userVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.ForgotPasswordToken,
        status
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    })
  }

  private signInvitationToken(payload: { email: string; role_id: string }) {
    return signToken({
      payload: {
        ...payload,
        token_type: TokenType.InvitationToken
      },
      privateKey: process.env.JWT_SECRET_INVITATION_TOKEN as string,
      options: {
        expiresIn: process.env.INVITATION_TOKEN_EXPIRES_IN as SignOptions['expiresIn']
      }
    })
  }

  private signAccessAndRefreshToken({
    user_id,
    status,
    role,
    permissions,
    owner_id
  }: {
    user_id: string
    status: userVerifyStatus
    role?: string
    permissions?: string[]
    owner_id?: string
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, status, role, permissions, owner_id }),
      this.signRefreshsToken({ user_id, status, role, permissions, owner_id })
    ])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  private async getRoleAndPermissions(user_id: string) {
    const result = await databaseService.userRoles
      .aggregate([
        { $match: { user_id: new ObjectId(user_id) } },
        {
          $lookup: {
            from: process.env.DB_ROLES_COLLECTION as string,
            localField: 'role_id',
            foreignField: '_id',
            as: 'role_info'
          }
        },
        { $unwind: '$role_info' },
        {
          $lookup: {
            from: process.env.DB_ROLE_PERMISSIONS_COLLECTION as string,
            localField: 'role_id',
            foreignField: 'role_id',
            as: 'role_permissions'
          }
        },
        {
          $lookup: {
            from: process.env.DB_PERMISSIONS_COLLECTION as string,
            localField: 'role_permissions.permission_id',
            foreignField: '_id',
            as: 'permissions_info'
          }
        }
      ])
      .toArray()

    const role_code = result[0]?.role_info?.code
    const permissions = result[0]?.permissions_info?.map((p: any) => p.code) || []
    let owner_id = result[0]?.owner_id?.toString()

    // If teacher, owner is self
    if (role_code === RoleCode.TEACHER) {
      owner_id = user_id
    }

    return { role_code, permissions, owner_id }
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const status = userVerifyStatus.Unverified

    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      status
    })

    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        password: hashPassword(payload.password),
        status
      })
    )

    // Assign default role: USER with scope STUDENT
    const role = await databaseService.roles.findOne({ code: RoleCode.USER })
    if (role) {
      await databaseService.userRoles.insertOne({
        user_id,
        role_id: role._id,
        scope_type: RoleScopeType.STUDENT,
        scope_id: null,
        granted_by: user_id, // Self registration
        created_at: new Date()
      })
    }

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      status,
      role: RoleCode.USER,
      permissions: [PermissionCode.STUDENT_VIEW] // Default permissions for student
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token,
        iat: iat as number,
        exp: exp as number
      })
    )

    // Follow verify email
    // 1. Server send email to user
    // 2. User click link in email
    // 3. Client send request to server with email_verify_token
    // 4. Server verify email_verify_token
    // 5. Client receive access_token and refresh_token

    // buoc nay test sau
    // await sendVerifyRegisterEmail(payload.email, email_verify_token)

    return {
      access_token,
      refresh_token,
      email_verify_token
    }
  }

  async login({ user_id, status }: { user_id: string; status: userVerifyStatus }) {
    const { role_code, permissions, owner_id } = await this.getRoleAndPermissions(user_id)

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      status,
      role: role_code,
      permissions,
      owner_id
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token,
        iat: iat as number,
        exp: exp as number
      })
    )

    return {
      access_token,
      refresh_token,
      role: role_code
    }
  }

  async verifyEmail(user_id: string) {
    const { role_code, permissions, owner_id } = await this.getRoleAndPermissions(user_id)

    const [tokens] = await Promise.all([
      this.signAccessAndRefreshToken({
        user_id,
        status: userVerifyStatus.Verified,
        role: role_code,
        permissions,
        owner_id
      }),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            status: userVerifyStatus.Verified
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])

    const [access_token, refresh_token] = tokens
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token,
        iat: iat as number,
        exp: exp as number
      })
    )

    return {
      access_token,
      refresh_token,
      role: role_code
    }
  }

  async refreshToken({
    user_id,
    refresh_token,
    status,
    exp
  }: {
    user_id: string
    refresh_token: string
    status: userVerifyStatus
    exp: number
  }) {
    const { role_code, permissions, owner_id } = await this.getRoleAndPermissions(user_id)
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, status, role: role_code, permissions, owner_id }),
      this.signRefreshsToken({ user_id, status, role: role_code, permissions, owner_id, exp }),
      databaseService.refreshToken.deleteOne({ token: refresh_token })
    ])
    const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)
    await databaseService.refreshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token,
        iat: decoded_refresh_token.iat,
        exp: decoded_refresh_token.exp
      })
    )

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async forgotPassword({ user_id, status, email }: { user_id: string; status: userVerifyStatus; email: string }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, status })
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            forgot_password_token,
            updated_at: '$$NOW'
          }
        }
      ]
    )

    // gửi email
    await sendForgotPasswordEmail(email, forgot_password_token)

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }
  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }

  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async getMeById(_id: string) {
    const user = await databaseService.users.findOne(
      {
        _id: new ObjectId(_id)
      },
      {
        projection: {
          password: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateMe(user_id: string, payload: UpdatedMeReqBody) {
    const _payload = payload.date_of_birth
      ? { ...payload, date_of_birth: new Date(payload.date_of_birth) }
      : { ...payload }

    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdatedMeReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )

    return user
  }

  async getUsers({ status, limit, page }: { status: number; limit: number; page: number }) {
    const users = await databaseService.users
      .aggregate([
        {
          $match: {
            status
          }
        },
        {
          $project: {
            email_verify_token: 0,
            forgot_password_token: 0,
            password: 0,
            email: 0
          }
        },
        {
          $sort: {
            created_at: -1
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.users.countDocuments({})

    return {
      users,
      total_page: Math.ceil(total / limit)
    }
  }

  async inviteTeacher(payload: { email: string; name: string; inviter_id: string }) {
    const role = await databaseService.roles.findOne({ code: RoleCode.TEACHER })
    if (!role) {
      throw new Error('Role TEACHER not found')
    }

    const token = await this.signInvitationToken({
      email: payload.email,
      role_id: (role._id as ObjectId).toString()
    })

    const expires_at = new Date()
    // Default 7 days
    expires_at.setDate(expires_at.getDate() + 7)

    await databaseService.invitations.insertOne(
      new Invitation({
        email: payload.email,
        role_id: role._id as ObjectId,
        scope_type: RoleScopeType.SYSTEM, // Teacher role scope is usually CLASS but invitation is for the role itself
        scope_id: null,
        inviter_id: new ObjectId(payload.inviter_id),
        token,
        status: InvitationStatus.PENDING,
        expires_at
      })
    )

    // Log the link (actually would send email)
    console.log(`Invitation Link: http://localhost:3000/join?token=${token}`)

    return { token }
  }

  async acceptInvitation(payload: AcceptInvitationReqBody) {
    const decoded_invitation_token = await verifyToken({
      token: payload.token,
      secretOrPublicKey: process.env.JWT_SECRET_INVITATION_TOKEN as string
    })

    const invitation = await databaseService.invitations.findOne({
      token: payload.token,
      status: InvitationStatus.PENDING
    })

    if (!invitation) {
      throw new Error('Invitation not found or already used')
    }

    if (new Date() > invitation.expires_at) {
      await databaseService.invitations.updateOne(
        { _id: invitation._id },
        { $set: { status: InvitationStatus.EXPIRED } }
      )
      throw new Error('Invitation expired')
    }

    // Create User
    const user_id = new ObjectId()
    await databaseService.users.insertOne(
      new User({
        _id: user_id,
        name: decoded_invitation_token.email, // Use email as name initially if not provided
        email: invitation.email,
        password: hashPassword(payload.password),
        status: userVerifyStatus.Verified // Invitations are pre-verified
      })
    )

    // Assign Role
    await databaseService.userRoles.insertOne(
      new UserRole({
        user_id,
        role_id: invitation.role_id,
        scope_type: invitation.scope_type,
        scope_id: invitation.scope_id,
        granted_by: invitation.inviter_id,
        created_at: new Date()
      })
    )

    // Mark invitation as accepted
    await databaseService.invitations.updateOne(
      { _id: invitation._id },
      { $set: { status: InvitationStatus.ACCEPTED } }
    )

    return this.login({ user_id: user_id.toString(), status: userVerifyStatus.Verified })
  }
}

const usersService = new UsersService()
export default usersService
