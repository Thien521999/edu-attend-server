import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Teacher from '~/models/schemas/Teacher.schema'
import { CreateTeacherReqBody, UpdateTeacherReqBody } from '~/models/requests/Teacher.requests'

class TeachersService {
  async createTeacher(user_id: string, payload: CreateTeacherReqBody) {
    const teacher_id = new ObjectId()
    const result = await databaseService.teachers.insertOne(
      new Teacher({
        _id: teacher_id,
        user_id: new ObjectId(user_id), // Link to Teacher User
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        address: payload.address || '',
        date_of_birth: payload.date_of_birth ? new Date(payload.date_of_birth) : undefined,
        start_date: payload.start_date ? new Date(payload.start_date) : undefined,
        specialization: payload.specialization || '',
        status: 'ACTIVE'
      })
    )
    return result
  }

  async getTeachers({ page, limit }: { page: number; limit: number }) {
    const teachers = await databaseService.teachers
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await databaseService.teachers.countDocuments()
    return {
      teachers,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getTeacherDetail(id: string) {
    const teacher = await databaseService.teachers.findOne({ _id: new ObjectId(id) })
    return teacher
  }

  async updateTeacher(id: string, payload: UpdateTeacherReqBody) {
    const updateData: any = {
      ...payload,
      updated_at: new Date()
    }

    if (payload.date_of_birth) updateData.date_of_birth = new Date(payload.date_of_birth)
    if (payload.start_date) updateData.start_date = new Date(payload.start_date)

    const result = await databaseService.teachers.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteTeacher(id: string) {
    const result = await databaseService.teachers.deleteOne({ _id: new ObjectId(id) })
    return result
  }
}

const teachersService = new TeachersService()
export default teachersService
