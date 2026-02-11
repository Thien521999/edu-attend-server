export interface CreateTeachingAssignmentReqBody {
  teacher_id: string
  class_id: string
  subject_id: string
  academic_year_id: string
  start_date?: string
  end_date?: string
}

export interface UpdateTeachingAssignmentReqBody {
  teacher_id?: string
  class_id?: string
  subject_id?: string
  academic_year_id?: string
  start_date?: string
  end_date?: string
  status?: string // 'ACTIVE' | 'INACTIVE'
}
