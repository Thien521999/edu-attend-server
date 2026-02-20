import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import AttendanceSession from '~/models/schemas/AttendanceSession.schema'
import AttendanceRecord from '~/models/schemas/AttendanceRecord.schema'
import {
  CreateAttendanceSessionReqBody,
  BatchCreateAttendanceRecordsReqBody
} from '~/models/requests/Attendance.requests'

class AttendancesService {
  async createSession(payload: CreateAttendanceSessionReqBody) {
    const session_id = new ObjectId()
    const result = await databaseService.attendanceSessions.insertOne(
      new AttendanceSession({
        _id: session_id,
        class_id: new ObjectId(payload.class_id),
        date: new Date(payload.date),
        subject_id: payload.subject_id ? new ObjectId(payload.subject_id) : undefined,
        teacher_id: new ObjectId(payload.teacher_id),
        type: payload.type || 'SUBJECT',
        status: 'OPEN'
      })
    )
    return result
  }

  async getSessions({ page, limit }: { page: number; limit: number }) {
    const sessions = await databaseService.attendanceSessions
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const total = await databaseService.attendanceSessions.countDocuments()
    return {
      sessions,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getSessionDetail(id: string) {
    const session = await databaseService.attendanceSessions.findOne({ _id: new ObjectId(id) })
    if (!session) return null

    // Lấy danh sách học sinh cùng trạng thái điểm danh cho buổi này
    const records = await databaseService.students
      .aggregate([
        {
          $match: {
            class_id: session.class_id,
            status: 'STUDYING'
          }
        },
        {
          $lookup: {
            from: 'attendance_records',
            let: { student_id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$attendance_session_id', new ObjectId(id)] },
                      { $eq: ['$student_id', '$$student_id'] }
                    ]
                  }
                }
              }
            ],
            as: 'record'
          }
        },
        {
          $addFields: {
            attendance_status: { $ifNull: [{ $arrayElemAt: ['$record.status', 0] }, 'NOT_MARKED'] },
            attendance_note: { $ifNull: [{ $arrayElemAt: ['$record.note', 0] }, ''] }
          }
        },
        {
          $project: {
            record: 0
          }
        }
      ])
      .toArray()

    return {
      ...session,
      students: records
    }
  }

  async updateSession(id: string, payload: any) {
    const updateData: any = {
      ...payload,
      updated_at: new Date()
    }
    if (payload.class_id) updateData.class_id = new ObjectId(payload.class_id)
    if (payload.subject_id) updateData.subject_id = new ObjectId(payload.subject_id)
    if (payload.teacher_id) updateData.teacher_id = new ObjectId(payload.teacher_id)
    if (payload.date) updateData.date = new Date(payload.date)

    const result = await databaseService.attendanceSessions.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteSession(id: string) {
    // Xoá session và tất cả records liên quan
    await Promise.all([
      databaseService.attendanceSessions.deleteOne({ _id: new ObjectId(id) }),
      databaseService.attendanceRecords.deleteMany({ attendance_session_id: new ObjectId(id) })
    ])
    return { message: 'Delete session and records success' }
  }

  async batchCreateRecords(payload: BatchCreateAttendanceRecordsReqBody) {
    // Note: Request Body uses 'session_id' but Schema uses 'attendance_session_id'
    // We map it here.
    const records = payload.records.map(
      (record) =>
        new AttendanceRecord({
          _id: new ObjectId(),
          attendance_session_id: new ObjectId(payload.session_id),
          student_id: new ObjectId(record.student_id),
          status: record.status as 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED',
          note: record.note
        })
    )

    // Use bulkWrite for upsert functionality
    const operations = records.map((record) => ({
      updateOne: {
        filter: { attendance_session_id: record.attendance_session_id, student_id: record.student_id },
        update: { $set: record },
        upsert: true
      }
    }))

    const result = await databaseService.attendanceRecords.bulkWrite(operations)
    return result
  }

  async getReport({ class_id, date }: { class_id: string; date: string }) {
    const reportDate = new Date(date)
    // Set to start and end of day to find session
    const startOfDay = new Date(reportDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(reportDate.setHours(23, 59, 59, 999))

    // Aggregation pipeline:
    // 1. Match students in the specified class who are still 'STUDYING'
    // 2. Lookup attendance records for those students nested with their session
    const result = await databaseService.students
      .aggregate([
        {
          $match: {
            class_id: new ObjectId(class_id),
            status: 'STUDYING'
          }
        },
        {
          $lookup: {
            from: 'attendance_sessions',
            let: { class_id: '$class_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$class_id', '$$class_id'] },
                      { $gte: ['$date', startOfDay] },
                      { $lte: ['$date', endOfDay] }
                    ]
                  }
                }
              }
            ],
            as: 'session_info'
          }
        },
        {
          $unwind: {
            path: '$session_info',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'attendance_records',
            let: { student_id: '$_id', session_id: '$session_info._id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$student_id', '$$student_id'] },
                      { $eq: ['$attendance_session_id', '$$session_id'] }
                    ]
                  }
                }
              }
            ],
            as: 'record_info'
          }
        },
        {
          $addFields: {
            attendance_status: {
              $ifNull: [{ $arrayElemAt: ['$record_info.status', 0] }, 'NOT_MARKED']
            },
            attendance_note: {
              $ifNull: [{ $arrayElemAt: ['$record_info.note', 0] }, '']
            }
          }
        },
        {
          $project: {
            _id: 1,
            student_code: 1,
            full_name: 1,
            attendance_status: 1,
            attendance_note: 1
          }
        },
        {
          $sort: { full_name: 1 }
        }
      ])
      .toArray()

    return result
  }
}

const attendancesService = new AttendancesService()
export default attendancesService
