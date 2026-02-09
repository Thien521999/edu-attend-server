import { ObjectId } from 'mongodb'

interface SchoolType {
  _id?: ObjectId
  name: string
  code: string // Mã trường (VD: "TH001")
  address: string
  phone: string
  email: string

  created_at?: Date
  updated_at?: Date
}

// School: Trường học
export default class School {
  _id?: ObjectId
  name: string // Tên trường (VD: "Trường THPT Nguyễn Văn A")
  code: string // Mã trường (VD: "TH001")
  address: string // Địa chỉ trường
  phone: string // Số điện thoại trường
  email: string // Email trường

  created_at: Date
  updated_at: Date

  constructor(school: SchoolType) {
    const date = new Date()
    this._id = school._id
    this.name = school.name
    this.code = school.code
    this.address = school.address
    this.phone = school.phone
    this.email = school.email

    this.created_at = school.created_at || date
    this.updated_at = school.updated_at || date
  }
}
