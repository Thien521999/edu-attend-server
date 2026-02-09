import { ObjectId } from 'mongodb'

interface ParentType {
  _id?: ObjectId
  user_id: ObjectId
  full_name: string
  phone: string
}

// Parent: Phụ huynh
export default class Parent {
  _id?: ObjectId
  user_id: ObjectId // link đến users collection
  full_name: string // Họ tên phụ huynh
  phone: string // Số điện thoại phụ huynh

  constructor(parent: ParentType) {
    this._id = parent._id
    this.user_id = parent.user_id
    this.full_name = parent.full_name
    this.phone = parent.phone
  }
}
