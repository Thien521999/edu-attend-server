# Luồng Đăng ký & Đăng nhập (Server vs Client)

> Mô hình: Trung tâm dạy thêm (Super Admin -> Cô giáo -> Học sinh)

---

## I. Luồng Đăng ký (Registration)

### 1. Đối với Super Admin (SUPER_ADMIN) - Khởi tạo hệ thống

| Phía Client (Giao diện)         | Phía Server (Xử lý)                                                                      |
| :------------------------------ | :--------------------------------------------------------------------------------------- |
| Không có nút đăng ký công khai. | Chạy script **Seed Data** khi deploy hệ thống lần đầu hoặc tạo bằng lệnh trong Terminal. |
| Admin vào thẳng trang Login.    | Tạo 1 User đầu tiên với `Role: SUPER_ADMIN`, `status: Verified`.                         |

### 2. Đối với Cô giáo (TEACHER) - Luồng mời

| Phía Client (Giao diện)                                          | Phía Server (Xử lý)                                                                                                                                                   |
| :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin** nhập Email giáo viên + Tên -> Bấm "Gửi lời mời". | Tạo 1 bản ghi trong `Invitations` kèm `token` (JWT) + `expires_at`.                                                                                                   |
| Hệ thống gửi Email chứa link: `tuyensinh.vn/join?token=abc-123`. | Gửi email thông qua SMTP/Mailgun...                                                                                                                                   |
| **Cô giáo** click link -> Hiện trang "Thiết lập mật khẩu".       | (Không xử lý, chỉ trả về giao diện).                                                                                                                                  |
| Cô giáo nhập mật khẩu -> Bấm "Hoàn tất".                         | 1. Verify token trong `Invitations`. <br> 2. Tạo `User` (status: Verified). <br> 3. Gán `Role: TEACHER` trong `UserRoles`. <br> 4. Đánh dấu Invitation là `ACCEPTED`. |
| Chuyển hướng về trang Đăng nhập.                                 | Trả về thông báo thành công.                                                                                                                                          |

### 3. Đối với Học sinh (USER) - Luồng tự do

| Phía Client (Giao diện)                                | Phía Server (Xử lý)                                                                                                                                                       |
| :----------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Người dùng bấm "Đăng ký" -> Nhập Email/SĐT + Password. | 1. Tạo `User` (status: UNVERIFIED). <br> 2. Tạo và gửi mã xác thực Email (JWT).                                                                                           |
| Người dùng click link xác thực trong Email.            | Verify mã JWT -> Cập nhật `User.status = VERIFIED`.                                                                                                                       |
| Đăng nhập -> Hiện thông báo "Nhập mã lớp để bắt đầu".  | (Lúc này User chưa có quyền xem bất cứ lớp nào).                                                                                                                          |
| Nhập mã lớp (VD: TOAN10) -> Bấm "Liên kết".            | 1. Check mã lớp trong `Class.link_code`. <br> 2. Tạo `Student` record (gán `owner_id` của giáo viên lớp đó). <br> 3. Gán `Role: USER` (Scope: STUDENT) trong `UserRoles`. |

---

## II. Luồng Đăng nhập (Login)

| Phía Client (Giao diện)                                                                                                                                                             | Phía Server (Xử lý)                                                                                                                                                     |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nhập Email + Password -> Bấm "Login".                                                                                                                                               | 1. Kiểm tra Email/Password. <br> 2. Kiểm tra `status` (Nếu UNVERIFIED/BANNED thì trả lỗi).                                                                              |
| (Đang chờ xử lý).                                                                                                                                                                   | 3. Tìm Role của User trong `UserRoles`. <br> 4. Tìm danh sách Permissions của Role đó. <br> 5. Tạo **Access Token** (chứa user_id, role, owner_id) & **Refresh Token**. |
| Nhận Token -> Lưu Access Token vào bộ nhớ, Refresh Token vào `localStorage` hoặc Cookie.                                                                                            | Lưu Refresh Token vào Database (`refresh_tokens` collection).                                                                                                           |
| **Điều hướng (Navigation)**: <br> - Thấy Role `TEACHER` -> Vào Dashboard cô giáo. <br> - Thấy Role `USER` -> Check xem đã có record `Student` chưa -> Nếu chưa thì bắt nhập mã lớp. | Trả về JSON: `{ access_token, refresh_token, profile, role }`.                                                                                                          |

---

## III. Luồng Làm mới Token (Refresh Token Rotation)

| Phía Client (Giao diện)                                            | Phía Server (Xử lý)                                                                                                                                                                             |
| :----------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Khi Access Token hết hạn (API trả về lỗi 401).                     | (Trả về lỗi `TokenExpiredError`).                                                                                                                                                               |
| Tự động gọi API `/api/auth/refresh` kèm theo **Refresh Token** cũ. | 1. Verify Refresh Token (check tồn tại trong DB & chưa hết hạn). <br> 2. Xóa Refresh Token cũ trong DB. <br> 3. Tạo Access Token mới + Refresh Token mới. <br> 4. Lưu Refresh Token mới vào DB. |
| Lưu lại bộ Token mới và thực hiện lại API bị lỗi trước đó.         | Trả về bộ Token mới.                                                                                                                                                                            |

---

## 🛡️ Logic Bảo mật cho Scale (Quan trọng)

1.  **Server - Stateless Auth**: Server không giữ session. Mọi quyền hạn (`owner_id`, `permissions`) đều nằm trong Token.
2.  **Server - Owner Filter**: Mọi cô giáo khi thao tác dữ liệu, Server sẽ luôn lấy `owner_id` từ Token để lọc: `db.classes.find({ owner_id: token.owner_id })`.
3.  **Client - Interceptor**: Sử dụng Axios Interceptor để tự động xử lý lỗi 401 và refresh token mà người dùng không hề hay biết (Silent Refresh).

## IV. Giải thích luồng auth dễ scale sau này

- A. Linh hoạt khi mở rộng (Scalability)
  - Sau này trung tâm phát triển, bạn muốn thêm role MARKETING (chỉ được xem danh sách học sinh để gọi điện) hoặc ACCOUNTANT (chỉ được quản lý học phí).
  - Nếu dùng bảng riêng: Bạn chỉ cần chèn 1 dòng vào Roles và gán Permissions tương ứng. Không cần sửa code.
  - Nếu gộp vào User: Bạn sẽ phải sửa code check logic ở rất nhiều nơi.

- B. Quản lý Phạm vi (Scope/Owner ID)
  - Theo follow.md, giáo viên chỉ được quản lý học sinh của chính họ (owner_id).

  - Bảng UserRoles đóng vai trò là "cầu nối". Nó không chỉ nói "User A là Giáo viên", mà còn nói "User A là Giáo viên tại phạm vi (Scope) lớp TOAN10".

  - Khi Login, Server sẽ lấy thông tin này nhét vào Payload của Access Token. Từ đó, mọi API phía sau sẽ tự động biết để lọc dữ liệu theo đúng "chủ sở hữu".

- C. Phân quyền chi tiết (Granular Permissions)
  - Nhiều Role khác nhau có thể cùng có một Permission (ví dụ: cả SUPER_ADMIN và TEACHER đều xem được thông báo).

  - Việc tách bảng Permissions giúp bạn quản lý các "hành động" độc lập với "chức danh".

---

# IV. Review Schema & Brainstorming Ý tưởng (Mới cập nhật)

## 1. Review các bảng hiện tại (Phân tích chi tiết)

### ✅ Ưu điểm:

- Cấu trúc RBAC (`Roles`, `Permissions`, `UserRoles`) rất linh hoạt, hỗ trợ tốt cho việc phân quyền theo phạm vi (Scope).
- Các bảng được tách biệt rõ ràng theo từng thực thể học thuật (`Class`, `Student`, `Teacher`, `Subject`).

### ⚠️ Các điểm cần lưu ý/Sửa đổi:

- **Lỗi chính tả:** File `StudentParant.schema.ts` đang bị sai chính tả (nên là `StudentParent`).
- **Sự nhất quán (Consistency):**
  - Một số bảng dùng `owner_id` (trỏ đến `User`), một số dùng `teacher_id` (trỏ đến `Teacher`). Nên thống nhất để dễ code logic check quyền.
  - `TuitionFee` có `student_id` nhưng comment lại ghi là `Link đến users collection`. Nên thống nhất trỏ về collection `students`.
- **Dữ liệu thừa (Redundant):**
  - `enums.ts` còn sót lại các enum từ template cũ (`TweetType`, `BlogTopic`, v.v.). Nên dọn dẹp để code clean hơn.
- **Liên kết thiếu:**
  - Bảng `School` hiện đang đứng độc lập. Cần liên kết `Teacher` hoặc `Class` với `School` để quản lý đa trường (nếu sau này scale lên).

## 2. Các trường thông tin còn thiếu (Gợi ý bổ sung)

- **Student:** Bổ sung `date_of_birth`, `address`, `gender`, `phone` (nếu có).
- **TuitionFee:** Hiện đang thiếu `amount` (số tiền), `payment_date` (ngày nộp), `payment_method` (chuyển khoản/tiền mặt), và `description`. Ngoài ra, nên chia theo tháng/học kỳ thay vì chỉ theo năm học.
- **AttendanceRecord:** Bổ sung trường `note` (lý do vắng/đi muộn).
- **Timetable:** Bổ sung `room_name` (tên phòng học).

## 3. Brainstorming Ý tưởng tính năng tiếp theo (Lên ý tưởng Dev)

### 📊 A. Quản lý Học tập (Academic Management)

- **Exam & Score (Bài kiểm tra & Điểm số):** Cần bảng `Exams` (tên bài test, ngày test, hệ số điểm) và `Scores` (điểm của từng học sinh). Đây là lõi của mọi trung tâm.
- **Learning Materials (Tài liệu):** Cho phép giáo viên upload file (PDF, hình ảnh) cho từng môn học hoặc từng lớp.
- **Homework (Bài tập về nhà):** Giáo viên giao bài, học sinh có thể nộp bài (submission) trực tuyến.

### 🔔 B. Tương tác & Thông báo (Communication)

- **Notifications:** Hệ thống thông báo tự động cho phụ huynh khi:
  - Học sinh vắng mặt không phép.
  - Có thông báo đóng học phí.
  - Có điểm bài kiểm tra mới.
- **Announcement (Thông báo chung):** Super Admin gửi bảng tin cho toàn bộ giáo viên/học sinh.

### 💰 C. Quản lý Tài chính nâng cao (Finance)

- **Fee Configuration (Cấu hình học phí):** Quy định mức học phí cho từng khối/môn (VD: Toán 10 là 500k/tháng).
- **Salary (Lương giáo viên):** Tính lương dựa trên số tiết dạy (từ `AttendanceSession`) hoặc lương cứng.

### 📈 D. Báo cáo & Thống kê (Reports)

- **Dashboard cho Giáo viên:** Xem tỉ lệ chuyên cần trung bình, thống kê học phí đã thu/chưa thu.
- **Học bạ điện tử:** Tổng hợp điểm số và nhận xét của giáo viên theo từng tháng/kỳ.

---

_Ghi chú: Các ý tưởng trên có thể triển khai dần theo từng giai đoạn (Sprint)._
