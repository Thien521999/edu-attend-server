export interface CreateSubjectReqBody {
  name: string
  code: string
  school_id: string
  description?: string
  credits?: number
}

export interface UpdateSubjectReqBody {
  name?: string
  code?: string
  school_id?: string
  description?: string
  credits?: number
  is_active?: boolean
}
