import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import TeachingAssignment from '~/models/schemas/TeachingAssignment.schema'
import {
  CreateTeachingAssignmentReqBody,
  UpdateTeachingAssignmentReqBody
} from '~/models/requests/TeachingAssignment.requests'

class TeachingAssignmentsService {
  async createTeachingAssignment(payload: CreateTeachingAssignmentReqBody) {
    const assignment_id = new ObjectId()
    const result = await databaseService.teachingAssignments.insertOne(
      new TeachingAssignment({
        _id: assignment_id,
        teacher_id: new ObjectId(payload.teacher_id),
        class_id: new ObjectId(payload.class_id),
        subject_id: new ObjectId(payload.subject_id),
        academic_year_id: new ObjectId(payload.academic_year_id),
        start_date: payload.start_date ? new Date(payload.start_date) : undefined,
        end_date: payload.end_date ? new Date(payload.end_date) : undefined,
        status: 'ACTIVE'
      })
    )
    return result
  }

  async getTeachingAssignments({ page, limit }: { page: number; limit: number }) {
    const assignments = await databaseService.teachingAssignments
      .aggregate([
        {
          $lookup: {
            from: process.env.DB_TEACHERS_COLLECTION as string,
            localField: 'teacher_id',
            foreignField: '_id',
            as: 'teacher_info'
          }
        },
        { $unwind: { path: '$teacher_info', preserveNullAndEmptyArrays: true } },
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
          $lookup: {
            from: process.env.DB_SUBJECTS_COLLECTION as string,
            localField: 'subject_id',
            foreignField: '_id',
            as: 'subject_info'
          }
        },
        { $unwind: { path: '$subject_info', preserveNullAndEmptyArrays: true } },
        {
          $skip: (page - 1) * limit
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.teachingAssignments.countDocuments()
    return {
      assignments,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getTeachingAssignmentDetail(id: string) {
    const assignment = await databaseService.teachingAssignments.findOne({ _id: new ObjectId(id) })
    return assignment
  }

  async updateTeachingAssignment(id: string, payload: UpdateTeachingAssignmentReqBody) {
    const updateData: any = {
      ...payload,
      updated_at: new Date()
    }

    if (payload.teacher_id) updateData.teacher_id = new ObjectId(payload.teacher_id)
    if (payload.class_id) updateData.class_id = new ObjectId(payload.class_id)
    if (payload.subject_id) updateData.subject_id = new ObjectId(payload.subject_id)
    if (payload.academic_year_id) updateData.academic_year_id = new ObjectId(payload.academic_year_id)
    if (payload.start_date) updateData.start_date = new Date(payload.start_date)
    if (payload.end_date) updateData.end_date = new Date(payload.end_date)

    const result = await databaseService.teachingAssignments.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteTeachingAssignment(id: string) {
    const result = await databaseService.teachingAssignments.deleteOne({ _id: new ObjectId(id) })
    return result
  }
}

const teachingAssignmentsService = new TeachingAssignmentsService()
export default teachingAssignmentsService
