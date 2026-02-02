import { ObjectId } from 'mongodb'
import { userVerifyStatus } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  name: string
  email: string
  password: string
  forgot_password_token?: string // jwt or '' nếu đã xác thực email
  status?: userVerifyStatus
  avatar?: string // optional
  cover_photo?: string // optional

  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  status: userVerifyStatus
  forgot_password_token: string
  avatar: string
  cover_photo: string

  created_at: Date
  updated_at: Date

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id
    this.name = user.name
    this.email = user.email
    this.password = user.password

    this.status = user.status || userVerifyStatus.Unverified
    this.forgot_password_token = user.forgot_password_token || ''


    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''

    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
  }
}
