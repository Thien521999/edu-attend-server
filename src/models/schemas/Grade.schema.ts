import { ObjectId } from 'mongodb'

interface GradeType {
  _id?: ObjectId
  name: String
  level: Number
}

// Grade: Khối học
export default class Grade {
  _id?: ObjectId
  name: String // Tên khối (VD: "10", "11", "12")
  level: Number // Số thứ tự khối (VD: 10, 11, 12)

  constructor(grade: GradeType) {
    this._id = grade._id
    this.name = grade.name
    this.level = grade.level
  }
}
