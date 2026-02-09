import { ObjectId } from 'mongodb'
import { AttendanceStatus } from '~/constants/enums'

interface AttendanceRecordType {
  _id?: ObjectId
  attendance_session_id: ObjectId
  student_id: ObjectId
  status: AttendanceStatus // 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  note?: string
}

// PRESENT: Có mặt
// ABSENT: Vắng mặt
// LATE: Đi muộn
// EXCUSED: Có phép

// AttendanceRecord: Bảng ghi điểm danh
export default class AttendanceRecord {
  _id?: ObjectId
  attendance_session_id: ObjectId
  student_id: ObjectId
  status: AttendanceStatus
  note?: string // Lý do vắng/đi muộn

  constructor(attendanceRecord: AttendanceRecordType) {
    this._id = attendanceRecord._id
    this.attendance_session_id = attendanceRecord.attendance_session_id
    this.student_id = attendanceRecord.student_id
    this.status = attendanceRecord.status
    this.note = attendanceRecord.note || ''
  }
}
