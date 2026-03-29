import { ObjectId } from 'mongodb'

interface GradeType {
  _id?: ObjectId
  name: string
  level: number
  school_id: ObjectId
}

// Grade: Khối học
export default class Grade {
  _id?: ObjectId
  name: string // Tên khối (VD: "10", "11", "12")
  level: number // Số thứ tự khối (VD: 10, 11, 12)
  school_id: ObjectId

  constructor(grade: GradeType) {
    this._id = grade._id
    this.name = grade.name
    this.level = grade.level
    this.school_id = grade.school_id
  }
}
