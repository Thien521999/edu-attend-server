import { ObjectId } from 'mongodb'

interface TeacherType {
  _id?: ObjectId
  user_id: ObjectId
  school_id?: ObjectId // ID của Trường học (Optional because can be freelance or system)
  full_name: string
  phone: string
  email: string
  address?: string
  date_of_birth?: Date
  start_date?: Date
  specialization?: string
  status?: string // 'ACTIVE' | 'INACTIVE'

  created_at?: Date
  updated_at?: Date
}

// Teacher: Giáo viên
export default class Teacher {
  _id?: ObjectId
  user_id: ObjectId // link đến users collection
  school_id?: ObjectId // ID của Trường học
  full_name: string // Họ tên giáo viên
  phone: string // Số điện thoại giáo viên
  email: string
  address: string
  date_of_birth?: Date
  start_date?: Date
  specialization: string
  status: string

  created_at?: Date
  updated_at?: Date

  constructor(teacher: TeacherType) {
    const date = new Date()

    this._id = teacher._id
    this.user_id = teacher.user_id
    this.school_id = teacher.school_id
    this.full_name = teacher.full_name
    this.phone = teacher.phone
    this.email = teacher.email
    this.address = teacher.address || ''
    this.date_of_birth = teacher.date_of_birth
    this.start_date = teacher.start_date
    this.specialization = teacher.specialization || ''
    this.status = teacher.status || 'ACTIVE'

    this.created_at = teacher.created_at || date
    this.updated_at = teacher.updated_at || date
  }
}
