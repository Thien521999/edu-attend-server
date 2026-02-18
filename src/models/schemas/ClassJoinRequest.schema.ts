import { ObjectId } from 'mongodb'
import { JoinRequestStatus } from '~/constants/enums'

interface ClassJoinRequestType {
  _id?: ObjectId
  user_id: ObjectId // User requesting to join
  class_id: ObjectId // Class to join
  full_name: string // Student name
  student_code?: string // Optional student code
  status: JoinRequestStatus // PENDING | APPROVED | REJECTED
  rejected_reason?: string // Optional rejection reason
  created_at?: Date
  updated_at?: Date
}

// ClassJoinRequest: Yêu cầu tham gia lớp
export default class ClassJoinRequest {
  _id?: ObjectId
  user_id: ObjectId // User yêu cầu tham gia
  class_id: ObjectId // Lớp muốn tham gia
  full_name: string // Tên học sinh
  student_code?: string // Mã sinh viên (optional)
  status: JoinRequestStatus // Trạng thái: PENDING | APPROVED | REJECTED
  rejected_reason?: string // Lý do từ chối (nếu bị reject)
  created_at: Date
  updated_at: Date

  constructor(request: ClassJoinRequestType) {
    const date = new Date()

    this._id = request._id
    this.user_id = request.user_id
    this.class_id = request.class_id
    this.full_name = request.full_name
    this.student_code = request.student_code
    this.status = request.status
    this.rejected_reason = request.rejected_reason
    this.created_at = request.created_at || date
    this.updated_at = request.updated_at || date
  }
}
