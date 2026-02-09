import { ObjectId } from 'mongodb'

// - teacher_id: link đến teachers collection, để biết giáo viên nào quản lý học sinh này
// - Dùng cho các bảng như Timetable (Thời khóa biểu) hoặc  AttendanceSession
//  (Buổi điểm danh). Khi bạn muốn hiện tên giáo viên lên lịch học, bạn trỏ vào Teacher._id để lấy nhanh full_name, phone từ profile của họ.
// Ví dụ thực tế: Một trung tâm có thể có 1 cô chủ nhiệm (Owner của lớp/học sinh) nhưng lại có nhiều giáo viên bộ môn khác nhau dạy lớp đó (teacher_id).

// Các bảng mang tính thực thi giảng dạy (như TeachingAssignment, Timetable, AttendanceSession) nên
// dùng teacher_id để trỏ vào profile người dạy.

interface TeachingAssignmentType {
  _id?: ObjectId
  teacher_id: ObjectId
  class_id: ObjectId
  subject_id: ObjectId
}

// TeachingAssignment: Phân công giảng dạy
export default class TeachingAssignment {
  _id?: ObjectId
  teacher_id: ObjectId // link đến teachers collection
  class_id: ObjectId // link đến classes collection
  subject_id: ObjectId // link đến subjects collection

  constructor(teachingAssignment: TeachingAssignmentType) {
    this._id = teachingAssignment._id
    this.teacher_id = teachingAssignment.teacher_id
    this.class_id = teachingAssignment.class_id
    this.subject_id = teachingAssignment.subject_id
  }
}
