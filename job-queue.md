# Job Queue trong EduAttend (BullMQ + Redis)

Hệ thống Job Queue được sử dụng để xử lý các tác vụ tiêu tốn thời gian chạy ngầm (Background Tasks), giúp tăng trải nghiệm người dùng bằng cách phản hồi API ngay lập tức.

## 1. Các ý chính về Job Queue

- **BullMQ:** Thư viện mạnh mẽ được sử dụng để quản lý hàng đợi (Queue) dựa trên Redis.
- **Asynchronous Processing:** Xử lý bất đồng bộ. Thay vì bắt User chờ gửi mail xong mới đăng ký được, hệ thống đẩy việc gửi mail vào Queue và trả kết quả cho User ngay.
- **Retry Mechanism:** Tự động thử lại khi gặp lỗi (Project đang cấu hình thử lại tối đa 3 lần với cơ chế _exponential backoff_ - tăng dần thời gian giãn cách giữa các lần thử).
- **Worker & Producer:**
  - **Producer:** Nơi đẩy công việc vào hàng đợi (`queue.services.ts`).
  - **Worker:** Nơi trực tiếp thực hiện công việc chạy ngầm (`email.worker.ts`).

## 2. Tại sao cần dùng Job Queue?

- **Tốc độ:** Giảm thời gian phản hồi API (Response Time).
- **Độ tin cậy:** Đảm bảo các tác vụ quan trọng (như gửi Email) không bị mất nếu server bận hoặc gặp lỗi đột xuất.
- **Khả năng mở rộng:** Có thể tách Worker sang một server riêng nếu lượng công việc tăng cao.

## 3. Cách kiểm tra & Quản lý

- **Log Terminal:** Xem các dòng log bắt đầu bằng `Processing email job...` và `Email job completed...`.
- **Redis Inspection:**
  - Sử dụng `redis-cli keys "bull:email*"` để xem các key quản lý hàng đợi.
- **BullBoard (Tùy chọn):** Có thể tích hợp thêm giao diện dashboard để quản lý Queue trực quan hơn nếu cần.

## 4. Các file liên quan trong dự án

- `src/services/queue.services.ts`: Khai báo Queue và hàm thêm Job.
- `src/workers/email.worker.ts`: Định nghĩa logic xử lý khi có Job mới trong hàng đợi.
- `src/index.ts`: Nơi khởi chạy Worker cùng với server.
