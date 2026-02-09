import { ObjectId } from 'mongodb'

// - teacher_id: link đến teachers collection, để biết giáo viên nào quản lý học sinh này
// - Dùng cho các bảng như Timetable (Thời khóa biểu) hoặc  AttendanceSession
//  (Buổi điểm danh). Khi bạn muốn hiện tên giáo viên lên lịch học, bạn trỏ vào Teacher._id để lấy nhanh full_name, phone từ profile của họ.
// Ví dụ thực tế: Một trung tâm có thể có 1 cô chủ nhiệm (Owner của lớp/học sinh) nhưng lại có nhiều giáo viên bộ môn khác nhau dạy lớp đó (teacher_id).

// Các bảng mang tính thực thi giảng dạy (như TeachingAssignment, Timetable, AttendanceSession) nên
// dùng teacher_id để trỏ vào profile người dạy.

interface TimetableType {
  _id?: ObjectId
  class_id: ObjectId
  subject_id: ObjectId
  teacher_id: ObjectId
  day_of_week: number
  period_from: number
  period_to: number
  room_name?: string
}

// Timetable: thời khóa biểu
export default class Timetable {
  _id?: ObjectId
  class_id: ObjectId // link đến classes collection
  subject_id: ObjectId // link đến subjects collection
  teacher_id: ObjectId // link đến teachers collection
  day_of_week: number // 0-6 (0 là Chủ Nhật)
  period_from: number // tiết bắt đầu
  period_to: number // tiết kết thúc
  room_name?: string // Tên phòng học

  constructor(timetable: TimetableType) {
    this._id = timetable._id
    this.class_id = timetable.class_id
    this.subject_id = timetable.subject_id
    this.teacher_id = timetable.teacher_id
    this.day_of_week = timetable.day_of_week
    this.period_from = timetable.period_from
    this.period_to = timetable.period_to
    this.room_name = timetable.room_name || ''
  }
}
