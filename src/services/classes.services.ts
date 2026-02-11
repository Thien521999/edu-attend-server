import { ObjectId } from 'mongodb'
import { RoleCode } from '~/constants/enums'
import { CreateClassReqBody, UpdateClassReqBody } from '~/models/requests/Class.requests'
import Class from '~/models/schemas/Class.schema'
import databaseService from '~/services/database.services'

class ClassesService {
  async createClass(owner_id: string, payload: CreateClassReqBody) {
    const class_id = new ObjectId()
    const result = await databaseService.classes.insertOne(
      new Class({
        ...payload,
        _id: class_id,
        owner_id: new ObjectId(owner_id),
        grade_id: new ObjectId(payload.grade_id),
        school_id: new ObjectId(payload.school_id),
        academic_year_id: new ObjectId(payload.academic_year_id),
        link_code: payload.link_code || Math.random().toString(36).substring(2, 8).toUpperCase(),
        created_at: new Date(),
        updated_at: new Date()
      })
    )
    return await databaseService.classes.findOne({ _id: result.insertedId })
  }

  async getClasses(user_id: string, role: string) {
    const filter = role === RoleCode.SUPER_ADMIN ? {} : { owner_id: new ObjectId(user_id) }
    const classes = await databaseService.classes.find(filter).toArray()
    return classes
  }

  async getClassDetail(id: string) {
    const result = await databaseService.classes.findOne({ _id: new ObjectId(id) })
    return result
  }

  async updateClass(id: string, payload: UpdateClassReqBody) {
    const updateData = {
      ...payload,
      grade_id: payload.grade_id ? new ObjectId(payload.grade_id) : undefined,
      school_id: payload.school_id ? new ObjectId(payload.school_id) : undefined,
      academic_year_id: payload.academic_year_id ? new ObjectId(payload.academic_year_id) : undefined,
      updated_at: new Date()
    }

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if ((updateData as any)[key] === undefined) {
        delete (updateData as any)[key]
      }
    })

    const result = await databaseService.classes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteClass(id: string) {
    const result = await databaseService.classes.deleteOne({ _id: new ObjectId(id) })
    return result
  }
}

const classesService = new ClassesService()
export default classesService
