import { StudentStatus } from '~/constants/enums'

export interface CreateStudentReqBody {
  school_id: string
  student_code: string
  full_name: string
  class_id: string
  academic_year_id: string
  status?: StudentStatus
  date_of_birth?: string // ISO8601 string
  address?: string
  gender?: string
  phone?: string
  scholarship_percentage?: number
  scholarship_description?: string
}

export interface UpdateStudentReqBody {
  student_code?: string
  full_name?: string
  class_id?: string
  academic_year_id?: string
  status?: StudentStatus
  date_of_birth?: string
  address?: string
  gender?: string
  phone?: string
  scholarship_percentage?: number
  scholarship_description?: string
}
