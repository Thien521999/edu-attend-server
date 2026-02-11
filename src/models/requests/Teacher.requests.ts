export interface CreateTeacherReqBody {
  full_name: string
  email: string
  phone: string
  address?: string
  date_of_birth?: string
  start_date?: string
  specialization?: string
}

export interface UpdateTeacherReqBody {
  full_name?: string
  phone?: string
  address?: string
  date_of_birth?: string
  start_date?: string
  specialization?: string
  status?: string // 'ACTIVE' | 'INACTIVE'
}
