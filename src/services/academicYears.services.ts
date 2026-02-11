import { ObjectId } from 'mongodb'
import { CreateAcademicYearReqBody, UpdateAcademicYearReqBody } from '~/models/requests/AcademicYear.requests'
import AcademicYear from '~/models/schemas/AcademicYear.schema'
import databaseService from '~/services/database.services'

class AcademicYearsService {
  async createAcademicYear(payload: CreateAcademicYearReqBody) {
    const academic_year_id = new ObjectId()
    const result = await databaseService.academicYears.insertOne(
      new AcademicYear({
        ...payload,
        _id: academic_year_id,
        start_date: new Date(payload.start_date),
        end_date: new Date(payload.end_date)
      })
    )
    return await databaseService.academicYears.findOne({ _id: result.insertedId })
  }

  async getAcademicYears() {
    return await databaseService.academicYears.find({}).toArray()
  }

  async getAcademicYearDetail(id: string) {
    return await databaseService.academicYears.findOne({ _id: new ObjectId(id) })
  }

  async updateAcademicYear(id: string, payload: UpdateAcademicYearReqBody) {
    const updateData = {
      ...payload,
      start_date: payload.start_date ? new Date(payload.start_date) : undefined,
      end_date: payload.end_date ? new Date(payload.end_date) : undefined
    }

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if ((updateData as any)[key] === undefined) {
        delete (updateData as any)[key]
      }
    })

    const result = await databaseService.academicYears.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteAcademicYear(id: string) {
    return await databaseService.academicYears.deleteOne({ _id: new ObjectId(id) })
  }
}

const academicYearsService = new AcademicYearsService()
export default academicYearsService
