import { ObjectId } from 'mongodb'

interface TeachingAssignmentType {
  _id?: ObjectId
  teacher_id: ObjectId
  class_id: ObjectId
  subject_id: ObjectId
  academic_year_id: ObjectId
  start_date?: Date
  end_date?: Date
  status?: string // 'ACTIVE', 'INACTIVE'

  created_at?: Date
  updated_at?: Date
}

// TeachingAssignment: Phân công giảng dạy
export default class TeachingAssignment {
  _id?: ObjectId
  teacher_id: ObjectId // link đến teachers collection
  class_id: ObjectId // link đến classes collection
  subject_id: ObjectId // link đến subjects collection
  academic_year_id: ObjectId
  start_date?: Date
  end_date?: Date
  status: string
  created_at: Date
  updated_at: Date

  constructor(teachingAssignment: TeachingAssignmentType) {
    const date = new Date()
    this._id = teachingAssignment._id
    this.teacher_id = teachingAssignment.teacher_id
    this.class_id = teachingAssignment.class_id
    this.subject_id = teachingAssignment.subject_id
    this.academic_year_id = teachingAssignment.academic_year_id
    this.start_date = teachingAssignment.start_date
    this.end_date = teachingAssignment.end_date
    this.status = teachingAssignment.status || 'ACTIVE'
    this.created_at = teachingAssignment.created_at || date
    this.updated_at = teachingAssignment.updated_at || date
  }
}
