import { ObjectId } from 'mongodb'

interface AcademicYearType {
  _id?: ObjectId
  name: string
  school_id: ObjectId
  start_date: Date
  end_date: Date
  is_active: boolean
}

// AcademicYear: Năm học
export default class AcademicYear {
  _id?: ObjectId
  name: string
  school_id: ObjectId
  start_date: Date
  end_date: Date
  is_active: boolean

  constructor(academicYear: AcademicYearType) {
    const date = new Date()

    this._id = academicYear._id
    this.name = academicYear.name
    this.school_id = academicYear.school_id
    this.start_date = academicYear.start_date || date
    this.end_date = academicYear.end_date || date
    this.is_active = academicYear.is_active || false
  }
}
