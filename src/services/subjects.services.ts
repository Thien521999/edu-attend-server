import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Subject from '~/models/schemas/Subject.schema'
import { CreateSubjectReqBody, UpdateSubjectReqBody } from '~/models/requests/Subject.requests'

class SubjectsService {
  async createSubject(payload: CreateSubjectReqBody) {
    const subject_id = new ObjectId()
    const result = await databaseService.subjects.insertOne(
      new Subject({
        _id: subject_id,
        name: payload.name,
        code: payload.code,
        description: payload.description || '',
        credits: payload.credits || 0,
        is_active: true
      })
    )
    return result
  }

  async getSubjects({ page, limit }: { page: number; limit: number }) {
    const subjects = await databaseService.subjects
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await databaseService.subjects.countDocuments()
    return {
      subjects,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getSubjectDetail(id: string) {
    const subject = await databaseService.subjects.findOne({ _id: new ObjectId(id) })
    return subject
  }

  async updateSubject(id: string, payload: UpdateSubjectReqBody) {
    const result = await databaseService.subjects.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...payload,
          updated_at: new Date()
        }
      },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteSubject(id: string) {
    const result = await databaseService.subjects.deleteOne({ _id: new ObjectId(id) })
    return result
  }
}

const subjectsService = new SubjectsService()
export default subjectsService
