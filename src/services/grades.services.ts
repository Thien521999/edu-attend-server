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
        _id: grade_id
      })
    )
    return await databaseService.grades.findOne({ _id: result.insertedId })
  }

  async getGrades() {
    return await databaseService.grades.find({}).toArray()
  }

  async getGradeDetail(id: string) {
    return await databaseService.grades.findOne({ _id: new ObjectId(id) })
  }

  async updateGrade(id: string, payload: UpdateGradeReqBody) {
    const result = await databaseService.grades.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: payload },
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
