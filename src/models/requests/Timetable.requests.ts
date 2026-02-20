export interface CreateTimetableReqBody {
  class_id: string
  academic_year_id: string
  term?: string
  start_date: string
  end_date: string
  schedule: {
    day_of_week: string // 'MONDAY', 'TUESDAY', etc.
    period: number // 1-10
    subject_id: string
    teacher_id?: string
    room?: string
  }[]
}

export interface UpdateTimetableReqBody {
  class_id?: string
  academic_year_id?: string
  term?: string
  start_date?: string
  end_date?: string
  schedule?: {
    day_of_week: string
    period: number
    subject_id: string
    teacher_id?: string
    room?: string
  }[]
}
