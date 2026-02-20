import { ObjectId } from 'mongodb'

// Các bảng mang tính quản lý (như Class , Student) nên có owner_id để lọc dữ liệu theo người quản lý.

interface ClassType {
  _id?: ObjectId
  name: string
  code: string
  link_code: string
  owner_id: ObjectId
  grade_id: ObjectId
  school_id: ObjectId
  academic_year_id: ObjectId

  created_at: Date
  updated_at: Date
}

// Class: Lớp học
export default class Class {
  _id?: ObjectId
  name: string // Tên lớp (VD: "Lớp 10A1")
  code: string // Mã lớp (VD: "TOAN_10A")
  link_code: string // Mã để học sinh nhập vào tham gia lớp (VD: "TOAN10-COMAI")
  owner_id: ObjectId // ID của Giáo viên tạo lớp (Teacher UserID)
  grade_id: ObjectId // Khối (10, 11, 12)
  school_id: ObjectId // ID của Trường học
  academic_year_id: ObjectId // Năm học (VD: "2024-2025")

  created_at: Date
  updated_at: Date

  constructor(classObj: ClassType) {
    const date = new Date()

    this._id = classObj._id
    this.name = classObj.name
    this.code = classObj.code
    this.link_code = classObj.link_code
    this.owner_id = classObj.owner_id
    this.grade_id = classObj.grade_id
    this.school_id = classObj.school_id
    this.academic_year_id = classObj.academic_year_id

    this.created_at = classObj.created_at || date
    this.updated_at = classObj.updated_at || date
  }
}
