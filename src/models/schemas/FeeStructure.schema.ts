import { ObjectId } from 'mongodb'

interface FeeStructureType {
  _id?: ObjectId
  school_id: ObjectId
  name: string // Tên cấu hình (VD: "Học phí Khối 10", "Khóa hè 2025")
  grade_id?: ObjectId // Áp dụng cho cả khối
  class_id?: ObjectId // Hoặc áp dụng riêng cho từng lớp
  base_amount: number // Học phí cơ bản
  currency?: string
  billing_cycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONE_TIME' // Chu kỳ thu
  description?: string
  is_active?: boolean
  academic_year_id: ObjectId

  created_at?: Date
  updated_at?: Date
}

// FeeStructure: Cấu hình định mức học phí
export default class FeeStructure {
  _id?: ObjectId
  school_id: ObjectId
  name: string
  grade_id?: ObjectId
  class_id?: ObjectId
  base_amount: number
  currency: string
  billing_cycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONE_TIME'
  description: string
  is_active: boolean
  academic_year_id: ObjectId
  created_at: Date
  updated_at: Date

  constructor(data: FeeStructureType) {
    const date = new Date()
    this._id = data._id
    this.school_id = data.school_id
    this.name = data.name
    this.grade_id = data.grade_id
    this.class_id = data.class_id
    this.base_amount = data.base_amount
    this.currency = data.currency || 'VND'
    this.billing_cycle = data.billing_cycle || 'MONTHLY'
    this.description = data.description || ''
    this.is_active = data.is_active !== undefined ? data.is_active : true
    this.academic_year_id = data.academic_year_id
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
