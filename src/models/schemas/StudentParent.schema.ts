import { ObjectId } from 'mongodb'
import { Relationship } from '~/constants/enums'

interface StudentParentType {
  _id?: ObjectId
  student_id: ObjectId
  parent_id: ObjectId
  relationship: Relationship
}

// GUARDIAN: người giám hộ

// StudentParent: Quan hệ giữa học sinh và phụ huynh
export default class StudentParent {
  _id?: ObjectId
  student_id: ObjectId // link đến students collection
  parent_id: ObjectId // link đến parents collection
  relationship: Relationship // 'FATHER' | 'MOTHER' | 'GUARDIAN'

  constructor(studentParent: StudentParentType) {
    this._id = studentParent._id
    this.student_id = studentParent.student_id
    this.parent_id = studentParent.parent_id
    this.relationship = studentParent.relationship
  }
}
