import { ObjectId } from 'mongodb'

// Các bảng mang tính thực thi giảng dạy (như TeachingAssignment, Timetable, AttendanceSession) nên
// dùng teacher_id để trỏ vào profile người dạy.

interface AttendanceSessionType {
  _id?: ObjectId
  class_id: ObjectId
  subject_id: ObjectId
  teacher_id: ObjectId
  date: Date
}

// AttendanceSession: Buổi điểm danh
export default class AttendanceSession {
  _id?: ObjectId
  class_id: ObjectId // link đến classes collection
  subject_id: ObjectId // link đến subjects collection
  teacher_id: ObjectId // link đến teachers collection
  date: Date // ngày điểm danh

  constructor(attendanceSession: AttendanceSessionType) {
    const date = new Date()

    this._id = attendanceSession._id
    this.class_id = attendanceSession.class_id
    this.subject_id = attendanceSession.subject_id
    this.teacher_id = attendanceSession.teacher_id
    this.date = attendanceSession.date || date
  }
}
