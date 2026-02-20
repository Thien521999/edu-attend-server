import { ObjectId } from 'mongodb'
import { TuitionFeeStatus } from '~/constants/enums'

interface TuitionFeeType {
  _id?: ObjectId
  student_id: ObjectId
  academic_year_id: ObjectId
  amount: number
  status: TuitionFeeStatus // 'PAID' | 'UNPAID'
  due_date: Date
  payment_date?: Date
  description?: string
}

// TuitionFee: Bảng thu học phí
export default class TuitionFee {
  _id?: ObjectId
  student_id: ObjectId // Link đến students collection
  academic_year_id: ObjectId // Link đến academic_years collection
  amount: number // Số tiền học phí
  status: TuitionFeeStatus // 'PAID' | 'UNPAID'
  due_date: Date // Hạn thanh toán
  payment_date?: Date // Ngày đã nộp
  description: string // Ghi chú (VD: "Học phí tháng 10")

  constructor(tuitionFee: TuitionFeeType) {
    this._id = tuitionFee._id
    this.student_id = tuitionFee.student_id
    this.academic_year_id = tuitionFee.academic_year_id
    this.amount = tuitionFee.amount || 0
    this.status = tuitionFee.status
    this.due_date = tuitionFee.due_date
    this.payment_date = tuitionFee.payment_date
    this.description = tuitionFee.description || ''
  }
}
