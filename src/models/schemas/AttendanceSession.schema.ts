import { ObjectId } from 'mongodb'

interface AttendanceSessionType {
  _id?: ObjectId
  class_id: ObjectId
  subject_id?: ObjectId
  teacher_id: ObjectId
  date: Date
  type: string // 'MORNING', 'AFTERNOON', 'FULL_DAY', 'SUBJECT'
  status?: string // 'OPEN', 'LOCKED'

  created_at?: Date
  updated_at?: Date
}

// AttendanceSession: Buổi điểm danh
export default class AttendanceSession {
  _id?: ObjectId
  class_id: ObjectId // link đến classes collection
  subject_id?: ObjectId // link đến subjects collection (Optional if FULL_DAY)
  teacher_id: ObjectId // link đến teachers collection
  date: Date // ngày điểm danh
  type: string
  status: string

  created_at: Date
  updated_at: Date

  constructor(attendanceSession: AttendanceSessionType) {
    const date = new Date()

    this._id = attendanceSession._id
    this.class_id = attendanceSession.class_id
    this.subject_id = attendanceSession.subject_id
    this.teacher_id = attendanceSession.teacher_id
    this.date = attendanceSession.date || date
    this.type = attendanceSession.type || 'SUBJECT'
    this.status = attendanceSession.status || 'OPEN'
    this.created_at = attendanceSession.created_at || date
    this.updated_at = attendanceSession.updated_at || date
  }
}
