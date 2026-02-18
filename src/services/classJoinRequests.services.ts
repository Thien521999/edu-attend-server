import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import ClassJoinRequest from '~/models/schemas/ClassJoinRequest.schema'
import { JoinRequestStatus } from '~/constants/enums'
import {
  CreateJoinRequestReqBody,
  GetJoinRequestsQuery,
  RejectJoinRequestReqBody
} from '~/models/requests/ClassJoinRequest.requests'
import { ErrorWithStatus } from '~/models/Error'
import { JOIN_REQUEST_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import Student from '~/models/schemas/Student.schema'
import { StudentStatus } from '~/constants/enums'

class ClassJoinRequestsService {
  // Học sinh submit join request
  async createJoinRequest({ user_id, payload }: { user_id: string; payload: CreateJoinRequestReqBody }) {
    const { link_code, full_name, student_code } = payload

    // 0. Kiểm tra user có tồn tại không
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    // 1. Kiểm tra link_code có tồn tại không
    const classData = await databaseService.classes.findOne({ link_code })
    if (!classData) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.INVALID_LINK_CODE,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // 2. Kiểm tra user đã là student của lớp này chưa
    const existingStudent = await databaseService.students.findOne({
      user_id: new ObjectId(user_id),
      class_id: classData._id
    })
    if (existingStudent) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.ALREADY_IN_CLASS,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // 3. Kiểm tra đã có request pending chưa
    const existingRequest = await databaseService.classJoinRequests.findOne({
      user_id: new ObjectId(user_id),
      class_id: classData._id,
      status: JoinRequestStatus.PENDING
    })
    if (existingRequest) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.ALREADY_REQUESTED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // 4. Tạo join request
    const joinRequest = new ClassJoinRequest({
      user_id: new ObjectId(user_id),
      class_id: classData._id as ObjectId,
      full_name,
      student_code,
      status: JoinRequestStatus.PENDING
    })

    const result = await databaseService.classJoinRequests.insertOne(joinRequest)
    return {
      ...joinRequest,
      _id: result.insertedId,
      class: classData
    }
  }

  // Giáo viên xem danh sách join requests của lớp
  async getJoinRequestsByClass({
    class_id,
    owner_id,
    query
  }: {
    class_id: string
    owner_id: string
    query: GetJoinRequestsQuery
  }) {
    // Kiểm tra class có tồn tại và thuộc về owner không
    const classData = await databaseService.classes.findOne({
      _id: new ObjectId(class_id),
      owner_id: new ObjectId(owner_id)
    })
    if (!classData) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.CLASS_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const skip = (page - 1) * limit

    const matchStage: any = { class_id: new ObjectId(class_id) }
    if (query.status) {
      matchStage.status = query.status
    }

    const result = await databaseService.classJoinRequests
      .aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        {
          $addFields: {
            user: { $arrayElemAt: ['$user_info', 0] }
          }
        },
        {
          $project: {
            user_info: 0,
            'user.password': 0
          }
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $sort: { created_at: -1 } }, { $skip: skip }, { $limit: limit }]
          }
        }
      ])
      .toArray()

    const requests = result[0]?.data || []
    const total = result[0]?.metadata[0]?.total || 0

    return {
      requests,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit)
    }
  }

  // Giáo viên approve join request
  async approveJoinRequest({ request_id, owner_id }: { request_id: string; owner_id: string }) {
    // 1. Lấy join request
    const joinRequest = await databaseService.classJoinRequests.findOne({ _id: new ObjectId(request_id) })
    if (!joinRequest) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.JOIN_REQUEST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // 2. Kiểm tra request đã được xử lý chưa
    if (joinRequest.status !== JoinRequestStatus.PENDING) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.JOIN_REQUEST_ALREADY_PROCESSED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // 3. Kiểm tra class thuộc về owner không
    const classData = await databaseService.classes.findOne({
      _id: joinRequest.class_id,
      owner_id: new ObjectId(owner_id)
    })
    if (!classData) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.CLASS_NOT_FOUND,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    // 4. Tạo Student record
    const student = new Student({
      user_id: joinRequest.user_id,
      owner_id: new ObjectId(owner_id),
      school_id: classData.school_id,
      student_code: joinRequest.student_code || '',
      full_name: joinRequest.full_name,
      class_id: joinRequest.class_id,
      academic_year_id: classData.academic_year_id,
      status: 'STUDYING' as StudentStatus
    })

    await databaseService.students.insertOne(student)

    // 5. Update join request status
    await databaseService.classJoinRequests.updateOne(
      { _id: new ObjectId(request_id) },
      { $set: { status: JoinRequestStatus.APPROVED, updated_at: new Date() } }
    )

    return {
      message: JOIN_REQUEST_MESSAGES.APPROVE_JOIN_REQUEST_SUCCESS,
      student
    }
  }

  // Giáo viên reject join request
  async rejectJoinRequest({
    request_id,
    owner_id,
    payload
  }: {
    request_id: string
    owner_id: string
    payload: RejectJoinRequestReqBody
  }) {
    // 1. Lấy join request
    const joinRequest = await databaseService.classJoinRequests.findOne({ _id: new ObjectId(request_id) })
    if (!joinRequest) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.JOIN_REQUEST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // 2. Kiểm tra request đã được xử lý chưa
    if (joinRequest.status !== JoinRequestStatus.PENDING) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.JOIN_REQUEST_ALREADY_PROCESSED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // 3. Kiểm tra class thuộc về owner không
    const classData = await databaseService.classes.findOne({
      _id: joinRequest.class_id,
      owner_id: new ObjectId(owner_id)
    })
    if (!classData) {
      throw new ErrorWithStatus({
        message: JOIN_REQUEST_MESSAGES.CLASS_NOT_FOUND,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    // 4. Update join request status
    await databaseService.classJoinRequests.updateOne(
      { _id: new ObjectId(request_id) },
      {
        $set: {
          status: JoinRequestStatus.REJECTED,
          rejected_reason: payload.reason,
          updated_at: new Date()
        }
      }
    )

    return {
      message: JOIN_REQUEST_MESSAGES.REJECT_JOIN_REQUEST_SUCCESS
    }
  }

  // Học sinh xem join requests của mình
  async getMyJoinRequests({ user_id }: { user_id: string }) {
    const requests = await databaseService.classJoinRequests
      .aggregate([
        { $match: { user_id: new ObjectId(user_id) } },
        {
          $lookup: {
            from: 'classes',
            localField: 'class_id',
            foreignField: '_id',
            as: 'class_info'
          }
        },
        {
          $addFields: {
            class: { $arrayElemAt: ['$class_info', 0] }
          }
        },
        {
          $project: {
            class_info: 0
          }
        },
        { $sort: { created_at: -1 } }
      ])
      .toArray()

    return requests
  }
}

const classJoinRequestsService = new ClassJoinRequestsService()
export default classJoinRequestsService
