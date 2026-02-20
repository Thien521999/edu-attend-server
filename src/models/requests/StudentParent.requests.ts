import { Relationship } from '~/constants/enums'

export interface LinkStudentParentReqBody {
  student_id: string
  parent_id: string
  relationship: Relationship
}

export interface UpdateStudentParentReqBody {
  relationship: Relationship
}
