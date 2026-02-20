export interface CreateFeeStructureReqBody {
  school_id: string
  name: string
  description?: string
  base_amount: number
  currency?: string
  billing_cycle: string // 'MONTHLY' | 'YEARLY' | 'ONE_TIME'
  academic_year_id: string
  grade_id?: string // Optional: specific to a grade
}

export interface UpdateFeeStructureReqBody {
  name?: string
  description?: string
  base_amount?: number
  currency?: string
  billing_cycle?: string
  is_active?: boolean
}

export interface CreateTuitionFeeReqBody {
  student_id: string
  fee_structure_id: string
  amount: number
  due_date: string
  status?: string // 'UNPAID' | 'PAID' | 'PARTIAL' | 'OVERDUE'
}

export interface UpdateTuitionFeeReqBody {
  amount?: number
  due_date?: string
  status?: string
}

export interface CreateTuitionInvoiceReqBody {
  student_id: string
  school_id: string
  fee_structure_id: string
  academic_year_id: string
  billing_month: number
  billing_year: number
  base_amount: number
  due_date: string
  description?: string
}

export interface UpdateTuitionInvoiceReqBody {
  base_amount?: number
  discount_percentage?: number
  discount_amount?: number
  scholarship_discount?: number
  total_amount?: number
  paid_amount?: number
  status?: string
  due_date?: string
  payment_date?: string
  payment_method?: string
  description?: string
}
