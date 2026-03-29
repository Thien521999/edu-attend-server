# Hướng dẫn Phỏng vấn: Logic Phân quyền Frontend (RBAC)

Dưới đây là kịch bản trả lời giúp bạn thể hiện tư duy kiến trúc và sự chuyên nghiệp khi nói về phân quyền FE dựa trên hệ thống thực tế bạn đã làm.

---

## Câu hỏi: "Bạn triển khai logic phân quyền ở Frontend như thế nào?"

### 1. Tư duy: Check Quyền (Permission) thay vì Check Vai trò (Role)

- **Cách trả lời**: _"Tôi áp dụng tư duy **Permission-based Authorization** thay vì Role-based. Nghĩa là tôi không kiểm tra User là Admin hay Teacher, mà tôi kiểm tra họ có mã quyền cụ thể (ví dụ: `STUDENT_DELETE`) hay không."_
- **Tại sao thuyết phục?**: Vì Role có thể thay đổi tập quyền hạn theo thời gian. Check theo mã quyền giúp FE độc lập (decoupled) với cấu trúc Role của Backend, làm mã nguồn bền vững hơn.

### 2. Kỹ thuật: Quản lý State tập trung & Abstraction

- **Cách trả lời**: _"Tôi giải mã danh sách quyền từ JWT Payload hoặc API `/me` và lưu vào **Global State** (Zustand/Redux). Sau đó, tôi đóng gói logic kiểm tra thành các công cụ dùng chung."_
- **Chi tiết**:
  - **Custom Hook**: `const canEdit = useHasPermission('STUDENT_EDIT')`
  - **Wrapper Component**: `<PermissionGate permission="STUDENT_EDIT"> <Button /> </PermissionGate>`
- **Tại sao thuyết phục?**: Chứng tỏ bạn biết cách viết code sạch, dễ bảo trì và tránh lặp lại logic (DRY).

### 3. Nâng cao: Khả năng xử lý theo Phạm vi (Contextual Scope)

- **Cách trả lời**: _"Hệ thống của tôi không chỉ có quyền hành động mà còn có **Quyền theo phạm vi (Scope)**. Ví dụ: giáo viên có quyền 'Sửa' nhưng chỉ ở Lớp 10A."_
- **Logic FE**: Kết hợp so khớp `permission_code` và `scope_id` (lấy từ URL hoặc Global Context). Nếu người dùng đang truy cập trang của Lớp 10B nhưng Scope chỉ cho 10A, các tính năng chỉnh sửa sẽ tự động bị khóa.

### 4. Câu chốt hạ (Ghi điểm tuyệt đối)

> _"FE phân quyền chủ yếu để **tối ưu trải nghiệm người dùng (UX)** - giúp họ chỉ thấy những gì họ cần và có quyền dùng. Còn **bảo mật thực thi (Security)** thì 100% phải nằm ở Backend Middleware. FE chỉ là lớp filter hiển thị, Backend mới là lớp thực thi chính sách."_

---

## Các từ khóa cần dùng (Keywords to use):

- **Source of Truth**: Backend là nguồn tin cậy duy nhất.
- **Granular Permissions**: Quyền hạn chi tiết đến từng hành động.
- **Decoupled**: FE không phụ thuộc vào cấu trúc Role của BE.
- **Route Guarding**: Chặn truy cập trang ngay từ Router.
- **Component-level masking**: Ẩn/hiện linh kiện dựa trên quyền.
