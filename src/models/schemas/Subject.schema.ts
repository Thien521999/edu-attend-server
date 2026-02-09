import { ObjectId } from 'mongodb'

interface SubjectType {
  _id?: ObjectId
  name: string
  code: string
  description?: string

  created_at?: Date
  updated_at?: Date
}

// Subject: Môn học
export default class Subject {
  _id?: ObjectId
  name: string // Tên môn học (VD: "Toán")
  code: string // Mã môn học (VD: "MATH")
  description?: string // Mô tả môn học

  created_at?: Date
  updated_at?: Date

  constructor(subject: SubjectType) {
    const date = new Date()
    this._id = subject._id
    this.name = subject.name
    this.code = subject.code
    this.description = subject.description || ''

    this.created_at = subject.created_at || date
    this.updated_at = subject.updated_at || date
  }
}
