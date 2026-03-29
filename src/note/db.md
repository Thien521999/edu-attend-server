<!-- Container 1 — AUTH / RBAC
- USERS
- ROLES
- PERMISSIONS
- USER_ROLES
- ROLE_PERMISSIONS -->

<!-- Container 2 — ACADEMIC CORE
- SCHOOLS
- ACADEMIC_YEARS
- GRADES
- CLASSES
- SUBJECTS
- TEACHERS
- STUDENTS
- PARENTS
- STUDENT_PARENTS
- TEACHING_ASSIGNMENTS -->

<!-- Container 3 — ATTENDANCE / OPERATION
- TIMETABLES
- ATTENDANCE_SESSIONS
- ATTENDANCE_RECORDS
- TUITION_FEES -->

## Mô hình đúng: RBAC + Scope

- User: tài khoản
- Role: vai trò nghiệp vụ
- Permission: hành động cụ thể
- Scope: được làm ở đâu

# - Rút gọn 3 Role chính:

- SUPER_ADMIN: Quản lý toàn hệ thống.
- TEACHER: Cô giáo (quyền như một Admin trong phạm vi mình sở hữu).
- USER: Học sinh/Phụ huynh (Gộp chung quyền xem cá nhân).

## 1. Phân tích `users` collection

// save DB là users

```ts
interface User {
  _id: ObjectId
  name: String
  email: String
  password: String
  status: userVerifyStatus // 'UNVERIFIED' | 'VERIFIED' | 'BANNED'

  forgot_password_token: string // Có thể giữ để check một lần hoặc dùng JWT tương tự

  avatar?: string // optional
  cover_photo?: string // optional

  created_at: Date
  updated_at: Date
}
```

- KHÔNG lưu role trực tiếp trong user

## 2. Phân tích `roles` collection

```ts
interface Role {
  _id: ObjectId
  code: RoleCode // 'SUPER_ADMIN' | 'TEACHER' | 'USER'
  description: String
}
```

## 3. Phân tích `permissions` collection

```ts
interface Permission {
  _id: ObjectId
  code: PermissionCode // Mã định danh duy nhất  // 'STUDENT_VIEW' | 'ATTENDANCE_MARK' | 'TUITION_MANAGE' // TUITION_MANAGE: quan ly hoa don
  module: PermissionModule //  Module/phân hệ mà permission thuộc về // 'STUDENT' | 'ATTENDANCE' | 'FINANCE' | 'TEACHER' | 'CLASS' | 'SUBJECT' | 'SCHEDULE' | 'GRADE' | 'REPORT' | 'SYSTEM' // ATTENDANCE: diem danh
  description: String // Mo ta permission
}
```

- Lợi ích của việc tách Permission ra collection riêng
  ✅ Tái sử dụng: Một permission có thể gán cho nhiều role
  ✅ Dễ mở rộng: Thêm permission mới không ảnh hưởng role
  ✅ Linh hoạt: Có thể tùy chỉnh permission cho từng role
  ✅ Audit: Dễ theo dõi ai có quyền gì
  ✅ Module hóa: Phân chia rõ ràng theo module/tính năng

- Quy ước đặt tên PermissionCode

- Format: {MODULE}\_{ACTION}

Các action phổ biến:

- VIEW - Xem
- CREATE - Tạo mới
- UPDATE - Cập nhật
- DELETE - Xóa
- MANAGE - Quản lý toàn bộ (bao gồm tất cả actions)
- MARK - Đánh dấu (dành cho attendance) // attendance: điểm danh
- APPROVE - Phê duyệt
- EXPORT - Xuất dữ liệu

## 4. Phân tích `role_permissions` collection

```ts
interface RolePermission {
  _id: ObjectId
  role_id: ObjectId // _id của role
  permission_id: ObjectId // _id của permission
}
```

## 5. Phân tích `user_roles` collection

```ts
interface UserRole {
  _id: ObjectId
  user_id: ObjectId // Người nhận role
  role_id: ObjectId // Role nào
  scope_type: RoleScopeType // 'SYSTEM' | 'CLASS' | 'STUDENT'
  scope_id: ObjectId | null // ID của Lớp hoặc Học sinh cụ thể
  granted_by: ObjectId // ID của người gán role (Super Admin hoặc Teacher)
  created_at: Date
}
```

// Luồng Invitation (Dành cho Teacher)

## 21. Phân tích `invitations` collection

```ts
interface Invitation {
  _id: ObjectId
  email: string
  role_id: ObjectId
  scope_type: RoleScopeType
  scope_id: ObjectId | null
  inviter_id: ObjectId // ID người gửi lời mời (Super Admin)
  token: string // token gửi qua email
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED'
  created_at: Date
  expires_at: Date
}
```

<!-- 📌 Cái này là xương sống -->

# GV chỉ được điểm danh class mình dạy

# Phụ huynh chỉ xem con mình

# Admin trường chỉ quản lý trường đó

## 6. Phân tích `schools` collection

```ts
interface School {
  _id: ObjectId //  ← Đây là scope_id khi scope_type = 'SCHOOL'
  name: String
  code: string // Mã trường (VD: "TH001")
  address: String
  phone: string
  email: string

  created_at: Date
  updated_at: Date
}
```

## 7. Phân tích `academic_years` collection

```ts
interface AcademicYear {
  _id: ObjectId
  name: String // "2024-2025"
  start_date: Date
  end_date: Date
  is_active: Boolean
}
```

## 8. Phân tích `grades` collection

```ts
interface Grade {
  _id: ObjectId
  name: String
  level: Number
}
```

## 9. Phân tích `classes` collection

```ts
interface Class {
  _id: ObjectId
  code: String // Mã lớp (VD: "TOAN_10A")
  name: String
  link_code: String // Mã để học sinh nhập vào tham gia lớp (VD: "TOAN10-COMAI")
  owner_id: ObjectId // ID của Giáo viên tạo lớp (Teacher UserID)
  grade_id: ObjectId // Khối (10, 11, 12)
  academic_year_id: ObjectId // Năm học (VD: "2024-2025")

  created_at: Date
  updated_at: Date
}
```

## 10. Phân tích `subjects` collection

```ts
interface Subject {
  _id: ObjectId // ← Đây là scope_id khi scope_type = 'SUBJECT'
  name: String // "Math"
  code: String // "MATH"
  description?: string

  created_at: Date
  updated_at: Date
}
```

## 11. Phân tích `teachers` collection

```ts
interface Teacher {
  _id: ObjectId
  user_id: ObjectId
  full_name: String
  phone: String

  created_at: Date
  updated_at: Date
}
```

## 12. Phân tích `students` collection

```ts
interface Student {
  _id: ObjectId
  user_id: ObjectId // Link đến users collection (Học sinh/Phụ huynh login)
  owner_id: ObjectId // ID của Giáo viên quản lý (Teacher UserID)
  student_code: String // Mã sinh viên (VD: "SV001")
  full_name: String
  class_id: ObjectId // Link đến classes collection
  academic_year_id: ObjectId // Link đến academic_years collection
  status: 'STUDYING' | 'LEFT'

  created_at: Date
  updated_at: Date
}
```

## 13. Phân tích `parents` collection

```ts
interface Parent {
  _id: ObjectId
  user_id: ObjectId
  full_name: String
  phone: String
}
```

## 14. Phân tích `student_parents` collection

```ts
interface StudentParent {
  _id: ObjectId
  student_id: ObjectId
  parent_id: ObjectId
  relation: 'FATHER' | 'MOTHER' | 'GUARDIAN'
}
```

## 15. Phân tích `teaching_assignments` collection

```ts
interface TeachingAssignment {
  _id: ObjectId
  teacher_id: ObjectId
  class_id: ObjectId
  subject_id: ObjectId
}
```

## 16. Phân tích `timetables` collection

```ts
interface Timetable {
  _id: ObjectId
  class_id: ObjectId
  subject_id: ObjectId
  teacher_id: ObjectId
  day_of_week: Number // 2–7
  period_from: Number
  period_to: Number
}
```

## 17. Phân tích `attendance_sessions` collection

```ts
interface AttendanceSession {
  _id: ObjectId
  class_id: ObjectId
  subject_id: ObjectId
  teacher_id: ObjectId
  date: Date
}
```

## 18. Phân tích `attendance_records` collection

```ts
interface AttendanceRecord {
  _id: ObjectId
  attendance_session_id: ObjectId
  student_id: ObjectId
  status: 'PRESENT' | 'ABSENT' | 'LATE'
  note: String
}
```

## 19. Phân tích `tuition_fees` collection

```ts
interface TuitionFee {
  _id: ObjectId
  student_id: ObjectId
  academic_year_id: ObjectId
  amount: Number
  status: 'PAID' | 'UNPAID'
  due_date: Date
}
```

## 20. Phân tích `refresh_tokens` collection

```ts
interface RefreshToken {
  _id: ObjectId
  token: string
  user_id: ObjectId
  // expires_at: Date // Thời điểm token hết hạn
  created_at: Date
}
```

<!-- INDEXES -->
<!-- export async function createIndexes(db) {
  await db.collection("users").createIndex({ email: 1 }, { unique: true });

  await db.collection("students").createIndex({ student_code: 1 }, { unique: true });
  await db.collection("students").createIndex({ class_id: 1 });

  await db.collection("user_roles").createIndex({ user_id: 1 });
  await db.collection("user_roles").createIndex({ role_id: 1, scope_type: 1 });

  await db.collection("attendance_records")
    .createIndex({ attendance_session_id: 1, student_id: 1 }, { unique: true });

  await db.collection("timetables")
    .createIndex({ class_id: 1, day_of_week: 1 });
  await db.collection("refresh_tokens").createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL Index tự động xóa token hết hạn
} -->

<!-- type -->

```ts
export enum userVerifyStatus {
  Unverified, // chưa xác thực email, mặc định 0
  Verified, // đã xác thực email, 1
  Banned // bị khoá 2
}
```

```ts
export enum RoleCode {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TEACHER = 'TEACHER',
  USER = 'USER'
}
```

```ts
export enum PermissionCode {
  STUDENT_VIEW = 'STUDENT_VIEW',
  ATTENDANCE_MARK = 'ATTENDANCE_MARK',
  TUITION_MANAGE = 'TUITION_MANAGE'
}
```

```ts
export enum PermissionModule {
  STUDENT = 'STUDENT', // Quản lý học sinh
  ATTENDANCE = 'ATTENDANCE', // Điểm danh
  FINANCE = 'FINANCE', // Tài chính (học phí, hóa đơn)
  TEACHER = 'TEACHER', // Quản lý giáo viên
  CLASS = 'CLASS', // Quản lý lớp học
  SUBJECT = 'SUBJECT', // Quản lý môn học
  SCHEDULE = 'SCHEDULE', // Thời khóa biểu
  GRADE = 'GRADE', // Quản lý điểm
  REPORT = 'REPORT', // Báo cáo
  SYSTEM = 'SYSTEM' // Cài đặt hệ thống
}
```

```ts
export enum RoleScopeType {
  SYSTEM = 'SYSTEM', // Xem/Quản lý toàn bộ (Super Admin)
  CLASS = 'CLASS', // Quản lý trong lớp dạy (Teacher)
  STUDENT = 'STUDENT' // Xem thông tin cá nhân (User)
}

<!-- 🎯 Tổng quan Flow  -->

- logic xử lý:
- Super Admin: Khi query, bạn không thêm điều kiện owner_id, hệ thống sẽ tự trả về tất cả.
- Teacher: Khi làm bất cứ hành động gì (Tạo lớp, điểm danh), Middleware sẽ tự lấy ID giáo viên từ Token và nhét vào owner_id. Điều này giúp hệ thống cực kỳ dễ scale vì code xử lý là giống hệt nhau cho mọi giáo viên.
```
