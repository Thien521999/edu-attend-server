# Redis in EduAttend

Redis là một hệ thống lưu trữ dữ liệu cấu trúc dạng **Key-Value** trong bộ nhớ (In-memory Database), được sử dụng trong dự án này với các mục đích chính sau:

## 1. Các ý chính về Redis trong dự án

- **Caching (Bộ nhớ đệm):** Lưu trữ kết quả của các truy vấn MongoDB phức tạp (như thông tin quyền hạn - Permissions) để tránh phải tính toán lại nhiều lần.
- **Tốc độ cực nhanh:** Vì dữ liệu nằm trên RAM, thời gian phản hồi thường chỉ tính bằng mili giây (ms).
- **TTL (Time To Live):** Hỗ trợ tự động xóa dữ liệu sau một khoảng thời gian (Project đang dùng 24 giờ cho cache quyền hạn).
- **Cache Invalidation:** Dễ dàng xóa dữ liệu cũ khi có sự thay đổi (như khi gán role mới cho user) để đảm bảo tính nhất quán.

## 2. Cách kiểm tra Redis (Troubleshooting)

- **Lệnh kết nối:** Sử dụng `redis-cli` (lưu ý: gõ đúng `redis-cli`, không phải `redis cli`).
- **Lệnh cơ bản:**
  - `keys *`: Xem tất cả các key đang lưu.
  - `get [key_name]`: Lấy giá trị của một key.
  - `del [key_name]`: Xóa một key thủ công.
  - `flushall`: Xóa sạch toàn bộ dữ liệu trong Redis.

## 3. Lệnh quản lý Redis trên macOS (Homebrew)

- **Khởi động:** `brew services start redis`
- **Dừng:** `brew services stop redis`
- **Kiểm tra trạng thái:** `brew services list`

## 4. Tại sao cần dùng?

Trong hệ thống RBAC (Phân quyền), việc kiểm tra quyền xảy ra ở **mọi Request**. Nếu không có Redis, MongoDB sẽ phải gánh một lượng truy vấn khổng lồ, làm chậm hệ thống khi số lượng User tăng lên.
