import { ObjectId } from 'mongodb'
import { TuitionFeeStatus } from '~/constants/enums'

interface TuitionInvoiceType {
  _id?: ObjectId
  student_id: ObjectId
  school_id: ObjectId
  fee_structure_id: ObjectId
  academic_year_id: ObjectId
  invoice_number: string // Mã hóa đơn (VD: INV-2025-02-001)
  billing_month: number // Tháng (1-12)
  billing_year: number // Năm

  base_amount: number // Số tiền gốc từ FeeStructure
  discount_percentage?: number // % giảm giá riêng cho hóa đơn này
  discount_amount?: number // Số tiền giảm giá cố định
  scholarship_discount?: number // Tiền giảm từ học bổng của học sinh

  total_amount: number // Tổng tiền cuối cùng phải nộp
  paid_amount?: number // Số tiền đã nộp (trong trường hợp PAID_PARTIAL)

  status: TuitionFeeStatus
  due_date: Date
  payment_date?: Date
  payment_method?: string // 'CASH' | 'BANK_TRANSFER' | 'MOMO'
  description?: string

  created_at?: Date
  updated_at?: Date
}

// TuitionInvoice: Hóa đơn học phí (theo tháng/định kỳ)
export default class TuitionInvoice {
  _id?: ObjectId
  student_id: ObjectId
  school_id: ObjectId
  fee_structure_id: ObjectId
  academic_year_id: ObjectId
  invoice_number: string
  billing_month: number
  billing_year: number
  base_amount: number
  discount_percentage: number
  discount_amount: number
  scholarship_discount: number
  total_amount: number
  paid_amount: number
  status: TuitionFeeStatus
  due_date: Date
  payment_date?: Date
  payment_method: string
  description: string
  created_at: Date
  updated_at: Date

  constructor(data: TuitionInvoiceType) {
    const date = new Date()
    this._id = data._id
    this.student_id = data.student_id
    this.school_id = data.school_id
    this.fee_structure_id = data.fee_structure_id
    this.academic_year_id = data.academic_year_id
    this.invoice_number = data.invoice_number
    this.billing_month = data.billing_month
    this.billing_year = data.billing_year
    this.base_amount = data.base_amount
    this.discount_percentage = data.discount_percentage || 0
    this.discount_amount = data.discount_amount || 0
    this.scholarship_discount = data.scholarship_discount || 0
    this.total_amount = data.total_amount
    this.paid_amount = data.paid_amount || 0
    this.status = data.status || 'UNPAID'
    this.due_date = data.due_date
    this.payment_date = data.payment_date
    this.payment_method = data.payment_method || ''
    this.description = data.description || ''
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
