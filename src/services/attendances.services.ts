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
    return session
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
}

const attendancesService = new AttendancesService()
export default attendancesService
