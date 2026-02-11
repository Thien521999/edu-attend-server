import { ObjectId } from 'mongodb'
import { CreateSchoolReqBody, UpdateSchoolReqBody } from '~/models/requests/School.requests'
import School from '~/models/schemas/School.schema'
import databaseService from '~/services/database.services'

class SchoolsService {
  async createSchool(payload: CreateSchoolReqBody) {
    const school_id = new ObjectId()
    const result = await databaseService.schools.insertOne(
      new School({
        ...payload,
        _id: school_id,
        created_at: new Date(),
        updated_at: new Date()
      })
    )
    return await databaseService.schools.findOne({ _id: result.insertedId })
  }

  async getSchools() {
    return await databaseService.schools.find({}).toArray()
  }

  async getSchoolDetail(id: string) {
    return await databaseService.schools.findOne({ _id: new ObjectId(id) })
  }

  async updateSchool(id: string, payload: UpdateSchoolReqBody) {
    const result = await databaseService.schools.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...payload, updated_at: new Date() } },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteSchool(id: string) {
    return await databaseService.schools.deleteOne({ _id: new ObjectId(id) })
  }
}

const schoolsService = new SchoolsService()
export default schoolsService
