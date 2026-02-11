export interface CreateAttendanceSessionReqBody {
  class_id: string
  date: string // ISO8601
  subject_id?: string
  teacher_id: string
  type: string // 'MORNING' | 'AFTERNOON' | 'FULL_DAY' | 'SUBJECT'
}

export interface UpdateAttendanceSessionReqBody {
  class_id?: string
  date?: string
  subject_id?: string
  teacher_id?: string
  type?: string
  status?: string // 'OPEN' | 'LOCKED'
}

export interface CreateAttendanceRecordReqBody {
  session_id: string
  student_id: string
  status: string // 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE'
  note?: string
}

export interface UpdateAttendanceRecordReqBody {
  status?: string
  note?: string
}

export interface BatchCreateAttendanceRecordsReqBody {
  session_id: string
  records: {
    student_id: string
    status: string
    note?: string
  }[]
}
