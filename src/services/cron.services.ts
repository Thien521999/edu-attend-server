import cron from 'node-cron'
import databaseService from './database.services'
import notificationService from './notifications.services'

export const initCronJobs = () => {
  // 1. Dọn dẹp Refresh Token hết hạn mỗi ngày vào lúc 00:00
  cron.schedule('0 0 * * *', async () => {
    console.log('--- Running Cron Job: Cleanup Expired Refresh Tokens ---')
    try {
      const result = await databaseService.refreshToken.deleteMany({
        exp: { $lt: new Date() } // $lt: lt là viết tắt của less than (nhỏ hơn)
      })
      console.log(`Cleaned up ${result.deletedCount} expired refresh tokens.`)
    } catch (error) {
      console.error('Error cleaning up tokens:', error)
    }
  })

  // 2. Tác vụ: Chốt điểm danh hàng ngày và thông báo cho phụ huynh lúc 23:00
  cron.schedule('0 23 * * *', async () => {
    // '0 23 * * *' : là 11 giờ đêm, 0 phút, mỗi ngày, mỗi tháng, mỗi ngày trong tuần
    console.log('--- Running Cron Job: Daily Attendance Closing & Notification ---')
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // 1. Tìm tất cả các buổi điểm danh trong ngày hôm nay
      const sessions = await databaseService.attendanceSessions.find({ date: { $gte: today } }).toArray()
      const sessionIds = sessions.map((s) => s._id)

      if (sessionIds.length === 0) {
        console.log('No attendance sessions found for today.')
        return
      }

      // 2. Tìm tất cả học sinh vắng mặt (ABSENT)
      const absentRecords = await databaseService.attendanceRecords
        .find({
          attendance_session_id: { $in: sessionIds },
          status: 'ABSENT'
        })
        .toArray()

      console.log(`Found ${absentRecords.length} absent records today.`)

      // 3. Với mỗi học sinh vắng, tìm phụ huynh và gửi thông báo
      for (const record of absentRecords) {
        // Tìm quan hệ Student-Parent
        const studentParents = await databaseService.studentParents.find({ student_id: record.student_id }).toArray()

        // Tìm thông tin Student để lấy tên
        const student = await databaseService.students.findOne({ _id: record.student_id })
        const studentName = student ? student.full_name : 'Học sinh'

        for (const sp of studentParents) {
          // Tìm Parent -> User để lấy fcm_token
          const parent = await databaseService.parents.findOne({ _id: sp.parent_id })
          if (parent) {
            const user = await databaseService.users.findOne({ _id: parent.user_id })
            if (user && user.fcm_token) {
              console.log(`Sending notification to Parent: ${parent.full_name} for Student: ${studentName}`)
              await notificationService.sendAbsentNotification(
                user.fcm_token,
                studentName,
                today.toLocaleDateString('vi-VN')
              )
            }
          }
        }
      }
      console.log('Daily attendance notification process completed.')
    } catch (error) {
      console.error('Error in daily attendance cron:', error)
    }
  })

  // 3. (Để TEST) Chạy mỗi phút 1 lần để xác nhận hệ thống hoạt động
  // Sau khi test thành công bạn có thể comment hoặc xóa đoạn này
  cron.schedule('* * * * *', () => {
    console.log(`[${new Date().toLocaleTimeString()}] Cron is active and pulse-checking...`)
  })

  console.log('Cron Jobs initialized successfully.')
}
