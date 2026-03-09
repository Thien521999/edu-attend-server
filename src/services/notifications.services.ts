class NotificationService {
  async sendAbsentNotification(fcmToken: string, studentName: string, date: string) {
    console.log(
      `[PUSH NOTIFICATION] To: ${fcmToken} | Message: Con em (${studentName}) vắng mặt trong buổi học ngày ${date}.`
    )

    // Khi bạn đã có file firbaseConfig.json, hãy dùng code dưới đây:
    /*
    import admin from 'firebase-admin'
    const message = {
      notification: {
        title: 'Thông báo vắng mặt',
        body: `Con em (${studentName}) vắng mặt trong buổi học ngày ${date}.`
      },
      token: fcmToken
    }
    return admin.messaging().send(message)
    */
  }
}

const notificationService = new NotificationService()
export default notificationService
