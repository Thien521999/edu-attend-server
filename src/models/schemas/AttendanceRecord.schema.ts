import { ObjectId } from 'mongodb'
import { AttendanceStatus } from '~/constants/enums'

interface AttendanceRecordType {
  _id?: ObjectId
  attendance_session_id: ObjectId
  student_id: ObjectId //
  status: AttendanceStatus // 'PRESENT': có mặt, 'ABSENT': vắng mặt, 'LATE': trễ, 'EXCUSED': có phép
  note?: string

  created_at?: Date
  updated_at?: Date
}

// AttendanceRecord: Bảng ghi điểm danh
export default class AttendanceRecord {
  _id?: ObjectId
  attendance_session_id: ObjectId
  student_id: ObjectId // student_id:
  status: AttendanceStatus
  note: string // Lý do vắng/đi muộn
  created_at: Date
  updated_at: Date

  constructor(attendanceRecord: AttendanceRecordType) {
    const date = new Date()
    this._id = attendanceRecord._id
    this.attendance_session_id = attendanceRecord.attendance_session_id
    this.student_id = attendanceRecord.student_id
    this.status = attendanceRecord.status
    this.note = attendanceRecord.note || ''
    this.created_at = attendanceRecord.created_at || date
    this.updated_at = attendanceRecord.updated_at || date
  }
}
