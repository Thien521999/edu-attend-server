export enum userVerifyStatus {
  Unverified, // chưa xác thực email, mặc định 0
  Verified, // đã xác thực email
  Banned // bị khoá
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken,
  InvitationToken
}

export enum RoleCode {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TEACHER = 'TEACHER',
  USER = 'USER'
}

export enum RoleScopeType {
  SYSTEM = 'SYSTEM', // Xem/Quản lý toàn bộ (Super Admin)
  CLASS = 'CLASS', // Quản lý trong lớp dạy (Teacher)
  STUDENT = 'STUDENT' // Xem thông tin cá nhân (User)
}

export enum PermissionCode {
  STUDENT_VIEW = 'STUDENT_VIEW',
  ATTENDANCE_MARK = 'ATTENDANCE_MARK',
  TUITION_MANAGE = 'TUITION_MANAGE'
}

export enum PermissionModule {
  STUDENT = 'STUDENT',
  ATTENDANCE = 'ATTENDANCE',
  FINANCE = 'FINANCE',
  TEACHER = 'TEACHER',
  CLASS = 'CLASS',
  SUBJECT = 'SUBJECT',
  SCHEDULE = 'SCHEDULE',
  GRADE = 'GRADE',
  REPORT = 'REPORT',
  SYSTEM = 'SYSTEM'
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED'
}

export type StudentStatus = 'STUDYING' | 'LEFT'

export type Relationship = 'FATHER' | 'MOTHER' | 'GUARDIAN'

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'

export type TuitionFeeStatus = 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED'

export enum ActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  MARK_ATTENDANCE = 'MARK_ATTENDANCE',
  PAY_TUITION = 'PAY_TUITION'
}
