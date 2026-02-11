import { ObjectId } from 'mongodb'

interface TimetableType {
  _id?: ObjectId
  class_id: ObjectId
  subject_id: ObjectId
  teacher_id?: ObjectId
  academic_year_id: ObjectId
  term?: string
  start_date?: Date
  end_date?: Date
  day_of_week: string // 'MONDAY' etc or number
  period: number
  room?: string

  created_at?: Date
  updated_at?: Date
}

// Timetable: thời khóa biểu (Single Slot)
export default class Timetable {
  _id?: ObjectId
  class_id: ObjectId // link đến classes collection
  subject_id: ObjectId // link đến subjects collection
  teacher_id?: ObjectId // link đến teachers collection
  academic_year_id: ObjectId
  term: string
  start_date?: Date
  end_date?: Date
  day_of_week: string
  period: number
  room: string
  created_at: Date
  updated_at: Date

  constructor(timetable: TimetableType) {
    const date = new Date()
    this._id = timetable._id
    this.class_id = timetable.class_id
    this.subject_id = timetable.subject_id
    this.teacher_id = timetable.teacher_id
    this.academic_year_id = timetable.academic_year_id
    this.term = timetable.term || ''
    this.start_date = timetable.start_date
    this.end_date = timetable.end_date
    this.day_of_week = timetable.day_of_week
    this.period = timetable.period
    this.room = timetable.room || ''
    this.created_at = timetable.created_at || date
    this.updated_at = timetable.updated_at || date
  }
}
