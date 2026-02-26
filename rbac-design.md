# Tài liệu Thiết kế RBAC (Role-Based Access Control)

Hệ thống EduAttend sử dụng mô hình RBAC với 5 collection cốt lõi để đảm bảo tính linh hoạt, bảo mật và khả năng mở rộng chi tiết.

## 1. Cấu trúc 5 Collection cốt lõi

| Collection         | Mục đích                                          | Tại sao cần?                                           |
| :----------------- | :------------------------------------------------ | :----------------------------------------------------- |
| **User**           | Lưu danh tính (email, password).                  | Trả lời câu hỏi: "Bạn là ai?"                          |
| **Role**           | Danh mục vai trò (TEACHER, STUDENT, ADMIN).       | Nhóm các quyền lại theo chức vụ.                       |
| **Permission**     | Danh mục hành động (VIEW_CLASS, MARK_ATTENDANCE). | Định nghĩa chi tiết những gì hành động được phép.      |
| **RolePermission** | Liên kết Role <-> Permission.                     | Quan hệ nhiều-nhiều giữa vai trò và hành động.         |
| **UserRole**       | Gán Role cho User + **Scope (Phạm vi)**.          | Cho phép phân quyền theo Lớp học hoặc Học sinh cụ thể. |

## 2. Tại sao thiết kế "Dài dòng"?

1.  **Quan hệ Nhiều-Nhiều (Many-to-Many)**: Một giáo viên có nhiều quyền, và một quyền (như "Xem lớp") được dùng bởi nhiều vai trò. Dùng bảng trung gian (**RolePermission**) giúp tránh lặp lại dữ liệu và dễ cập nhật.
2.  **Tính năng Scope (Phạm vi)**: Đây là điểm mạnh nhất. `UserRole` cho phép định nghĩa:
    - Ông A là **Teacher** của **Lớp 10A** (Scope: CLASS, ID: 10A).
    - Bà B là **Parent** của **Học sinh C** (Scope: STUDENT, ID: C).
    - _Nếu gộp vào User, bạn sẽ không thể lưu được thông tin chi tiết này một cách khoa học._
3.  **Dễ bảo trì**: Khi muốn thêm 1 quyền mới cho toàn bộ Giáo viên, bạn chỉ cần thêm 1 dòng vào `RolePermission`. Không cần cập nhật hàng ngàn bản ghi User.
4.  **Chuẩn công nghiệp**: Đây là cách các hệ thống lớn (AWS, Salesforce) quản lý quyền hạn để đảm bảo tính ổn định và bảo mật khi hệ thống phình to.

## 3. Mối liên hệ với Student và Teacher (Profiles)

Bạn có 2 collection khác là `Student` và `Teacher`. Đây là các **Hồ sơ** gắn liền với **Danh tính (User)**.

- **User**: Trả lời câu hỏi "Bạn có thể làm gì?".
- **Student/Teacher**: Trả lời câu hỏi "Bạn có thông tin gì?" (Họ tên, chuyên môn, mã số).

**Sở hữu dữ liệu (Data Ownership)**: Trong `Student.schema.ts`, trường `owner_id` lưu `user_id` của giáo viên. RBAC kiểm tra xem bạn có quyền xem học sinh không, sau đó hệ thống sẽ lọc tiếp `owner_id == current_user_id` để đảm bảo giáo viên chỉ thấy học sinh của mình.

## 4. Các thành phần bổ trợ

Hệ thống còn 3 thành phần hoàn tất bức tranh RBAC:

### A. Invitation (Lời mời) & ClassJoinRequest

Đây là **"Cổng vào"** của RBAC:

- **Invitation**: Lưu sẵn **Role** và **Scope** cho người dùng mới. Khi họ đăng ký, hệ thống tự động gán quyền.
- **ClassJoinRequest**: Cho phép người dùng yêu cầu một Role gắn với một Scope (Lớp). Sau khi được duyệt, bản ghi `UserRole` mới được tạo ra.

### B. Audit Log (Nhật ký hoạt động)

Đây là công cụ **"Giám sát"**:

- Lưu `user_id` và hành động thực hiện.
- Dùng để hậu kiểm: _"Ai đã dùng quyền gì để tác động vào dữ liệu?"_.

## 5. Logic Phân quyền FE (Dành cho Phỏng vấn)

Để trả lời thuyết phục, hãy giải thích cách FE xử lý logic dựa trên kiến trúc Backend hiện tại theo 3 cấp độ mã nguồn:

### Cấp độ 1: Quản lý State tập trung (Centralized Authority)

- **Logic**: Ngay sau khi Login, FE giải mã **JWT Payload** hoặc gọi `/me` để lấy danh sách `permissions[]` (VD: `['STUDENT_VIEW', 'ATTENDANCE_WRITE']`).
- **Thuyết phục**: _"Tôi không kiểm tra Role (ví dụ: `if(role === 'ADMIN')`) vì Role thường thay đổi quyền hạn theo thời gian. Thay vào đó, tôi kiểm tra trực tiếp **Permission Code**. Điều này giúp FE không cần quan tâm User đó là ai, chỉ cần quan tâm User đó được phép làm gì."_

### Cấp độ 2: Abstraction (Sử dụng Hook & Wrapper Component)

- **Logic**: Tạo Custom Hook `useHasPermission(code)` và Helper Component `<PermissionGate permission={code}>`.
- **Thuyết phục**: _"Để mã nguồn sạch và dễ bảo trì, tôi đóng gói logic check quyền vào một chỗ duy nhất. Nếu sau này hệ thống đổi cách lưu quyền (ví dụ từ mảng sang object bitmask), tôi chỉ cần sửa duy nhất tại Hook này thay vì đi tìm hàng trăm file để sửa."_

### Cấp độ 3: RBAC kết hợp Context (Xử lý Scope)

- **Logic**: FE lưu thông tin `scope_id` (ID lớp/học sinh) vào Global Context.
- **Thuyết phục**: _"Logic FE của tôi có khả năng xử lý **Phạm vi quyền**. Ví dụ, một giáo viên có quyền 'Sửa' nhưng chỉ ở Lớp 10A. FE sẽ kết hợp giữa `permissions` (quyền hành động) và `scope` (quyền đối tượng) để render UI. Nếu Giáo viên đang ở trang của Lớp 10B, nút 'Sửa' sẽ tự động bị ẩn dựa trên logic so khớp scope_id."_

> [!TIP]
> **Điểm mấu chốt**: _"Mục tiêu của FE là tối ưu UX (Clear UI). Tôi coi RBAC ở FE là một lớp filter hiển thị, còn Backend mới là lớp bảo mật thực thi. Sự tách biệt này giúp hệ thống vừa an toàn vừa có trải nghiệm mượt mà."_

---

**Tổng kết**: Kiến trúc của bạn gồm 5 lớp bảo mật: **Identity** (User) -> **Permission** (RBAC) -> **Context** (Profiles & Scopes) -> **Onboarding** (Invitation/JoinRequest) -> **Auditing** (AuditLogs).
