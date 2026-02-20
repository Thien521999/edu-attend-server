import { ObjectId } from 'mongodb'
import { CreateGradeReqBody, UpdateGradeReqBody } from '~/models/requests/Grade.requests'
import Grade from '~/models/schemas/Grade.schema'
import databaseService from '~/services/database.services'

class GradesService {
  async createGrade(payload: CreateGradeReqBody) {
    const grade_id = new ObjectId()
    const result = await databaseService.grades.insertOne(
      new Grade({
        ...payload,
        school_id: new ObjectId(payload.school_id),
        _id: grade_id
      })
    )
    return await databaseService.grades.findOne({ _id: result.insertedId })
  }

  async getGrades({ page, limit, school_id }: { page: number; limit: number; school_id?: string }) {
    const filter = school_id ? { school_id: new ObjectId(school_id) } : {}
    const grades = await databaseService.grades
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()
    const total = await databaseService.grades.countDocuments(filter)
    return {
      grades,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getGradeDetail(id: string) {
    return await databaseService.grades.findOne({ _id: new ObjectId(id) })
  }

  async updateGrade(id: string, payload: UpdateGradeReqBody) {
    const updateData: any = { ...payload }
    if (payload.school_id) updateData.school_id = new ObjectId(payload.school_id)

    const result = await databaseService.grades.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteGrade(id: string) {
    return await databaseService.grades.deleteOne({ _id: new ObjectId(id) })
  }
}

const gradesService = new GradesService()
export default gradesService
