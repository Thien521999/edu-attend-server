import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import FeeStructure from '~/models/schemas/FeeStructure.schema'
import TuitionInvoice from '~/models/schemas/TuitionInvoice.schema'
import { CreateFeeStructureReqBody, CreateTuitionInvoiceReqBody } from '~/models/requests/Financial.requests'

class FinancialService {
  // Fee Structures
  async createFeeStructure(payload: CreateFeeStructureReqBody) {
    const fee_id = new ObjectId()
    const result = await databaseService.feeStructures.insertOne(
      new FeeStructure({
        _id: fee_id,
        school_id: new ObjectId(payload.school_id),
        name: payload.name,
        description: payload.description || '',
        base_amount: payload.base_amount,
        currency: payload.currency || 'VND',
        billing_cycle: payload.billing_cycle as 'MONTHLY' | 'YEARLY' | 'ONE_TIME',
        academic_year_id: new ObjectId(payload.academic_year_id),
        grade_id: payload.grade_id ? new ObjectId(payload.grade_id) : undefined,
        is_active: true
      })
    )
    return result
  }

  async getFeeStructures({ page, limit }: { page: number; limit: number }) {
    const fees = await databaseService.feeStructures
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await databaseService.feeStructures.countDocuments()
    return {
      fees,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getFeeStructureDetail(id: string) {
    const fee = await databaseService.feeStructures.findOne({ _id: new ObjectId(id) })
    return fee
  }

  // Invoices
  async createInvoice(payload: CreateTuitionInvoiceReqBody) {
    const invoice_id = new ObjectId()
    // Generate Invoice Number logic
    const invoice_number = `INV-${payload.billing_year}-${payload.billing_month}-${new Date().getTime()}`

    const result = await databaseService.tuitionInvoices.insertOne(
      new TuitionInvoice({
        _id: invoice_id,
        student_id: new ObjectId(payload.student_id),
        school_id: new ObjectId(payload.school_id),
        fee_structure_id: new ObjectId(payload.fee_structure_id),
        academic_year_id: new ObjectId(payload.academic_year_id),
        invoice_number,
        billing_month: payload.billing_month,
        billing_year: payload.billing_year,
        base_amount: payload.base_amount,
        discount_percentage: 0,
        discount_amount: 0,
        scholarship_discount: 0,
        total_amount: payload.base_amount,
        paid_amount: 0,
        status: 'UNPAID',
        due_date: new Date(payload.due_date),
        payment_method: '',
        description: payload.description || ''
      })
    )
    return result
  }

  async getInvoices({ page, limit }: { page: number; limit: number }) {
    const invoices = await databaseService.tuitionInvoices
      .aggregate([
        {
          $lookup: {
            from: process.env.DB_STUDENTS_COLLECTION as string,
            localField: 'student_id',
            foreignField: '_id',
            as: 'student_info'
          }
        },
        { $unwind: { path: '$student_info', preserveNullAndEmptyArrays: true } },
        {
          $skip: (page - 1) * limit
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.tuitionInvoices.countDocuments()
    return {
      invoices,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getInvoiceDetail(id: string) {
    const invoice = await databaseService.tuitionInvoices.findOne({ _id: new ObjectId(id) })
    return invoice
  }
}

const financialService = new FinancialService()
export default financialService
