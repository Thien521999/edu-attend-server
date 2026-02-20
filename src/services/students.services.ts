import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Student from '~/models/schemas/Student.schema'
import { CreateStudentReqBody, UpdateStudentReqBody } from '~/models/requests/Student.requests'
import { StudentStatus } from '~/constants/enums'

class StudentsService {
  async createStudent(user_id: string, payload: CreateStudentReqBody) {
    const student_id = new ObjectId()
    const result = await databaseService.students.insertOne(
      new Student({
        _id: student_id,
        user_id: new ObjectId(user_id), // Or link to a Student User if they exist
        owner_id: new ObjectId(user_id), // Creator is owner for now, or based on logic
        school_id: new ObjectId(payload.school_id),
        student_code: payload.student_code,
        full_name: payload.full_name,
        class_id: new ObjectId(payload.class_id),
        academic_year_id: new ObjectId(payload.academic_year_id),
        status: payload.status || 'STUDYING',
        date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth) : undefined,
        address: payload.address,
        gender: payload.gender,
        phone: payload.phone,
        scholarship_percentage: payload.scholarship_percentage,
        scholarship_description: payload.scholarship_description
      })
    )
    return result
  }

  async getStudents({ page, limit }: { page: number; limit: number }) {
    const students = await databaseService.students
      .aggregate([
        {
          $lookup: {
            from: process.env.DB_CLASSES_COLLECTION as string,
            localField: 'class_id',
            foreignField: '_id',
            as: 'class_info'
          }
        },
        { $unwind: { path: '$class_info', preserveNullAndEmptyArrays: true } },
        {
          $skip: (page - 1) * limit
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.students.countDocuments()
    return {
      students,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getStudentDetail(id: string) {
    const student = await databaseService.students.findOne({ _id: new ObjectId(id) })
    return student
  }

  async updateStudent(id: string, payload: UpdateStudentReqBody) {
    const updateData: any = {
      ...payload,
      updated_at: new Date()
    }

    if (payload.class_id) updateData.class_id = new ObjectId(payload.class_id)
    if (payload.academic_year_id) updateData.academic_year_id = new ObjectId(payload.academic_year_id)
    if (payload.date_of_birth) updateData.date_of_birth = new Date(payload.date_of_birth)

    const result = await databaseService.students.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteStudent(id: string) {
    const result = await databaseService.students.deleteOne({ _id: new ObjectId(id) })
    return result
  }
}

const studentsService = new StudentsService()
export default studentsService
