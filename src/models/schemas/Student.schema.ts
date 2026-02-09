import { ObjectId } from 'mongodb'
import { StudentStatus } from '~/constants/enums'

// - owner_id: xác định chủ sở hữu (của user) để lọc quyền (Data Ownership)
// - Khi cô giáo đăng nhập, Access Token của cô ấy có chứa user_id. Ở phía Server, bạn chỉ cần một dòng code filter: db.classes.find({ owner_id: req.user_id }). Nó giúp logic check quyền cực kỳ nhanh và thống nhất ở mọi API mà không cần quan tâm profile cô giáo đó là gì.

interface StudentType {
  _id?: ObjectId
  user_id: ObjectId
  owner_id: ObjectId
  school_id: ObjectId // ID của Trường học
  student_code: string
  full_name: string
  class_id: ObjectId
  academic_year_id: ObjectId
  status: StudentStatus // 'STUDYING' | 'LEFT'
  date_of_birth?: Date
  address?: string
  gender?: string
  phone?: string
  scholarship_percentage?: number // % học bổng (VD: 50)
  scholarship_description?: string // Lý do học bổng

  created_at?: Date
  updated_at?: Date
}

// Student: Học sinh
export default class Student {
  _id?: ObjectId
  user_id: ObjectId // Link đến users collection (Học sinh/Phụ huynh login)
  owner_id: ObjectId // ID của Giáo viên quản lý (Teacher UserID)
  school_id: ObjectId // ID của Trường học
  student_code: string // Mã sinh viên (VD: "SV001")
  full_name: string // Tên học sinh
  class_id: ObjectId // Link đến classes collection
  academic_year_id: ObjectId // Link đến academic_years collection
  status: StudentStatus // 'STUDYING' | 'LEFT'
  date_of_birth?: Date
  address: string
  gender: string
  phone: string
  scholarship_percentage: number
  scholarship_description: string

  created_at?: Date
  updated_at?: Date

  constructor(student: StudentType) {
    const date = new Date()

    this._id = student._id
    this.user_id = student.user_id
    this.owner_id = student.owner_id
    this.school_id = student.school_id
    this.student_code = student.student_code
    this.full_name = student.full_name
    this.class_id = student.class_id
    this.academic_year_id = student.academic_year_id
    this.status = student.status
    this.date_of_birth = student.date_of_birth
    this.address = student.address || ''
    this.gender = student.gender || ''
    this.phone = student.phone || ''
    this.scholarship_percentage = student.scholarship_percentage || 0
    this.scholarship_description = student.scholarship_description || ''

    this.created_at = student.created_at || date
    this.updated_at = student.updated_at || date
  }
}
