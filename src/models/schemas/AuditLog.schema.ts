import { ObjectId } from 'mongodb'
import { ActionType } from '~/constants/enums'

interface AuditLogType {
  _id?: ObjectId
  user_id: ObjectId // Người thực hiện hành động
  school_id: ObjectId // ID của Trường học
  action: ActionType // Hành động được thực hiện
  target_id: ObjectId // ID của đối tượng bị tác động (class_id, student_id...)
  target_collection: string // Tên collection bị tác động (VD: 'students', 'attendance_records')
  old_value?: any // Giá trị trước khi sửa
  new_value?: any // Giá trị sau khi sửa
  ip_address?: string // Địa chỉ IP của người thực hiện hành động
  user_agent?: string
  created_at?: Date
}

// AuditLog: Nhật ký hoạt động hệ thống
export default class AuditLog {
  _id?: ObjectId
  user_id: ObjectId
  school_id: ObjectId
  action: ActionType
  target_id: ObjectId
  target_collection: string
  old_value: any
  new_value: any
  ip_address: string
  user_agent: string
  created_at: Date

  constructor(data: AuditLogType) {
    this._id = data._id
    this.user_id = data.user_id
    this.school_id = data.school_id
    this.action = data.action
    this.target_id = data.target_id
    this.target_collection = data.target_collection
    this.old_value = data.old_value || null
    this.new_value = data.new_value || null
    this.ip_address = data.ip_address || ''
    this.user_agent = data.user_agent || ''
    this.created_at = data.created_at || new Date()
  }
}
