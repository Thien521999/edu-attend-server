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

export enum MediaType {
  Image, // 0
  Video // 1
}

export enum TweetType {
  Tweet, // 0
  Retweet, // 1
  Comment, //2
  QuoteTweet //3
}

export enum BlogAudience {
  EveryOne,
  BlogCircle
}

export enum BlogTopic {
  FoodDrink,
  Adventure,
  BudgetTravel,
  LuxuryTravel
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
