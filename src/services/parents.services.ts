import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Parent from '~/models/schemas/Parent.schema'
import { CreateParentReqBody, UpdateParentReqBody } from '~/models/requests/Parent.requests'

class ParentsService {
  async createParent(user_id: string, payload: CreateParentReqBody) {
    const parent_id = new ObjectId()
    const result = await databaseService.parents.insertOne(
      new Parent({
        _id: parent_id,
        user_id: new ObjectId(user_id), // Link to Parent User
        full_name: payload.full_name,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        job: payload.job
      })
    )
    return result
  }

  async getParents({ page, limit }: { page: number; limit: number }) {
    const parents = await databaseService.parents
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await databaseService.parents.countDocuments()
    return {
      parents,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getParentDetail(id: string) {
    const parent = await databaseService.parents.findOne({ _id: new ObjectId(id) })
    return parent
  }

  async updateParent(id: string, payload: UpdateParentReqBody) {
    const result = await databaseService.parents.findOneAndUpdate(
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

  async deleteParent(id: string) {
    const result = await databaseService.parents.deleteOne({ _id: new ObjectId(id) })
    return result
  }
}

const parentsService = new ParentsService()
export default parentsService
