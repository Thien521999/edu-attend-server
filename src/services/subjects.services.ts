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
        school_id: new ObjectId(payload.school_id),
        description: payload.description || '',
        credits: payload.credits || 0,
        is_active: true
      })
    )
    return result
  }

  async getSubjects({ page, limit, school_id }: { page: number; limit: number; school_id?: string }) {
    const filter = school_id ? { school_id: new ObjectId(school_id) } : {}
    const subjects = await databaseService.subjects
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await databaseService.subjects.countDocuments(filter)
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
    const updateData: any = {
      ...payload,
      updated_at: new Date()
    }
    if (payload.school_id) updateData.school_id = new ObjectId(payload.school_id)

    const result = await databaseService.subjects.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
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
