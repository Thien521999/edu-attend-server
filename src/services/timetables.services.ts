import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Timetable from '~/models/schemas/Timetable.schema'
import { CreateTimetableReqBody, UpdateTimetableReqBody } from '~/models/requests/Timetable.requests'

class TimetablesService {
  async createTimetable(payload: CreateTimetableReqBody) {
    const timetableEntries: Timetable[] = payload.schedule.map((s) => {
      return new Timetable({
        _id: new ObjectId(),
        class_id: new ObjectId(payload.class_id),
        subject_id: new ObjectId(s.subject_id),
        teacher_id: s.teacher_id ? new ObjectId(s.teacher_id) : undefined,
        academic_year_id: new ObjectId(payload.academic_year_id),
        term: payload.term || '1',
        start_date: payload.start_date ? new Date(payload.start_date) : undefined,
        end_date: payload.end_date ? new Date(payload.end_date) : undefined,
        day_of_week: s.day_of_week,
        period: s.period,
        room: s.room
      })
    })

    const result = await databaseService.timetables.insertMany(timetableEntries)
    return result
  }

  async getTimetables({ page, limit }: { page: number; limit: number }) {
    const timetables = await databaseService.timetables
      .aggregate([
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
          $skip: (page - 1) * limit
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.timetables.countDocuments()
    return {
      timetables,
      total_page: Math.ceil(total / limit),
      total
    }
  }

  async getTimetableDetail(id: string) {
    const timetable = await databaseService.timetables.findOne({ _id: new ObjectId(id) })
    return timetable
  }

  async updateTimetable(id: string, payload: UpdateTimetableReqBody) {
    // This is tricky because we are updating a single slot now, BUT the request body structure suggests a batch update or updates to shared fields.
    // For simplicity, let's assume this updates a SINGLE slot if passed a single slot structure, or we need to rethink the request body.
    // The current UpdateTimetableReqBody has `schedule` array... that's for replacing the whole schedule?
    // Let's implement a simple update for a single document for now, assuming ID points to a single slot.
    // If the user wants to update the whole schedule for a class, they should probably delete old ones and create new ones, or we need a different API "bulk update".

    // For now, I will treat this as updating SHARED fields for a single slot, ignoring the 'schedule' array in payload if it exists (or maybe just updating the first item?).
    // A better approach would be to have UpdateTimetableSlotReqBody.
    // But adhering to the interface:

    const updateData: any = {
      updated_at: new Date()
    }

    if (payload.class_id) updateData.class_id = new ObjectId(payload.class_id)
    if (payload.academic_year_id) updateData.academic_year_id = new ObjectId(payload.academic_year_id)
    if (payload.term) updateData.term = payload.term
    // ... maps other fields

    // If schedule provided, maybe we update the slot details?
    if (payload.schedule && payload.schedule.length > 0) {
      const s = payload.schedule[0]
      if (s.subject_id) updateData.subject_id = new ObjectId(s.subject_id)
      if (s.teacher_id) updateData.teacher_id = new ObjectId(s.teacher_id)
      if (s.day_of_week) updateData.day_of_week = s.day_of_week
      if (s.period) updateData.period = s.period
      if (s.room) updateData.room = s.room
    }

    const result = await databaseService.timetables.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  }

  async deleteTimetable(id: string) {
    const result = await databaseService.timetables.deleteOne({ _id: new ObjectId(id) })
    return result
  }

  async deleteTimetableByClass(class_id: string) {
    const result = await databaseService.timetables.deleteMany({ class_id: new ObjectId(class_id) })
    return result
  }
}

const timetablesService = new TimetablesService()
export default timetablesService
