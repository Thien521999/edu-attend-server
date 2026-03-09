# Cron Jobs trong EduAttend (node-cron)

Hệ thống Cron Jobs được sử dụng để tự động hóa các tác vụ lặp đi lặp lại theo một lịch trình định trước, giúp duy trì hệ thống và thực hiện các nghiệp vụ tự động mà không cần sự can thiệp của con người.

## 1. Các khái niệm cơ bản

- **node-cron:** Thư viện cho phép lập lịch các tác vụ trong Node.js bằng cú pháp của crontab.
- **Cú pháp Cron (`* * * * *`):**
  - `*` (Phút): 0-59
  - `*` (Giờ): 0-23
  - `*` (Ngày trong tháng): 1-31
  - `*` (Tháng): 1-12
  - `*` (Ngày trong tuần): 0-7 (0 và 7 là Chủ Nhật)
  - Ví dụ: `0 23 * * *` nghĩa là chạy lúc **23:00 mỗi ngày**.

## 2. Các tác vụ đã triển khai trong EduAttend

### A. Dọn dẹp Refresh Token (`0 0 * * *`)

- **Thời gian:** 00:00 hàng ngày.
- **Mục đích:** Tìm và xóa các token đã hết hạn trong database để tránh tích tụ dữ liệu thừa.
- **Kỹ thuật:** Sử dụng toán tử `$lt` (Less Than - nhỏ hơn) để so sánh thời gian hết hạn (`exp`) với thời gian hiện tại.

### B. Thông báo vắng mặt tự động (`0 23 * * *`)

- **Thời gian:** 23:00 hàng ngày.
- **Mục đích:**
  - Quét danh sách điểm danh trong ngày.
  - Phát hiện học sinh vắng mặt (status: `ABSENT`).
  - Tìm thông tin Phụ huynh tương ứng thông qua quan hệ `StudentParent`.
  - Gửi thông báo Push (FCM) để nhắc nhở phụ huynh.
- **Lợi ích:** Tăng cường sự kết nối giữa nhà trường và gia đình, tự động hóa quy trình báo cáo.

### C. Pulse-check (`* * * * *`)

- **Thời gian:** Mỗi phút một lần.
- **Mục đích:** Ghi log để xác nhận hệ thống Cron vẫn đang hoạt động ổn định (có thể xóa khi lên production).

## 3. Tại sao cần dùng Cron Jobs?

- **Tự động hóa:** Giảm bớt các công việc thủ công cho giáo viên và quản trị viên.
- **Chính xác:** Đảm bảo các tác vụ quan trọng luôn được thực hiện đúng giờ.
- **Hiệu năng:** Thực hiện các tác vụ nặng (như dọn dẹp database) vào giờ thấp điểm (nửa đêm).

## 4. Các file liên quan

- `src/services/cron.services.ts`: Nơi định nghĩa các tác vụ và lịch trình.
- `src/services/notifications.services.ts`: Xử lý gửi thông báo Push.
- `src/index.ts`: Khởi chạy hệ thống Cron cùng lúc với server.
