import { ObjectId } from 'mongodb'

interface ParentType {
  _id?: ObjectId
  user_id: ObjectId
  full_name: string
  phone: string
  email?: string
  address?: string
  job?: string
  created_at?: Date
  updated_at?: Date
}

// Parent: Phụ huynh
export default class Parent {
  _id?: ObjectId
  user_id: ObjectId // link đến users collection
  full_name: string // Họ tên phụ huynh
  phone: string // Số điện thoại phụ huynh
  email: string
  address: string
  job: string
  created_at: Date
  updated_at: Date

  constructor(parent: ParentType) {
    const date = new Date()
    this._id = parent._id
    this.user_id = parent.user_id
    this.full_name = parent.full_name
    this.phone = parent.phone
    this.email = parent.email || ''
    this.address = parent.address || ''
    this.job = parent.job || ''
    this.created_at = parent.created_at || date
    this.updated_at = parent.updated_at || date
  }
}
