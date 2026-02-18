export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  USER_NOT_FOUND: 'User not found',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Name length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG: '6-50 chars, A-Z, a-z, 0-9, symbol required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_FROM_6_TO_50: 'Confirm password must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG: '6-50 chars, A-Z, a-z, 0-9, symbol required',

  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is requried',
  REFRESH_TOKEN_IS_REQUIRED: 'Reresh token is requried',
  REFRESH_TOKEN_IS_INVALID: 'Reresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESS: 'Logout success',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verify before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password is required',
  VERIFY_FORFOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  INVALID_FORFOT_PASSWORD: 'Invalid forgot password token',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  GET_My_PROFILE_SUCCESS: 'Get my profile success',
  USER_NOT_VERIFIED: 'User not verified',
  USER_BANNED: 'User is banned',
  BIO_MUST_BE_STRING: 'Bio must be string',
  BIO_LENGTH: 'Name must be from 1 to 200',
  LOCATION_MUST_BE_STRING: 'Location must be string',
  LOCATION_LENGTH: 'Location must be from 1 to 200',
  WEBSITE_MUST_BE_STRING: 'Website must be string',
  WEBSITE_LENGTH: 'Website must be from 1 to 200',
  USERNAME_MUST_BE_STRING: 'User name must be a string',
  USERNAME_INVALID: 'Username: 4-15 chars, letters, numbers, underscores, not all numbers',
  IMAGE_URL_MUST_BE_STRING: 'Cover photo must be string',
  IMAGE_URL_LENGTH: 'Avatar must be from 1 to 400',
  UPDATE_PROFILE_SUCCESS: 'Update profile success',
  FOLLOW_SUCCESS: 'Follow success',
  INVALID_USER_ID: 'Invalid user id',
  FOLLOWED: 'Followed',
  ALREADY_UNFOLLOWED: 'Already unfollowed',
  UNFOLLOW_SUCCESS: 'Unfollow success',
  USERNAME_EXISTED: 'Username existed',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  GET_ALL_USER_SUCCESSFULLY: 'Get all user successfully',
  NOT_FOLLOWING: 'Not following'
} as const // as const de khoi thay doi message nay

export const BLOG_MESSAGES = {
  INVALID_TYPE: 'Invalid type',
  INVALID_AUDIENCE: 'Invalid audience',
  PARENT_ID_MUST_BE_A_VALID_BLOG_ID: 'Parent id must be a valid blog id',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a non empty string',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be empty string',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user id',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias must be an array of media object',
  INVALID_BLOG_ID: 'Invalid blog id',
  BLOG_NOT_FOUND: 'Blog not found',
  BLOG_IS_NOT_PUBLIC: 'Blog is not public',
  TITLE_IS_REQUIRED: 'Title is required',
  TITLE_MUST_BE_A_STRING: 'Title must be a string',
  TITLE_LENGTH_MUST_BE_FROM_1_TO_1000: 'Title length must be from 1 to 1000',
  CONTENT_IS_REQUIRED: 'Content is required',
  CONTENT_MUST_BE_A_STRING: 'Content must be a string',
  CONTENT_LENGTH_MUST_BE_FROM_100_OR_MORE: 'Content length must be from 100 or more',
  INVALID_PROVINCE_ID: 'Invalid province id',
  CREATE_BLOG_SUCCESSFULLY: 'Create Blog successfully',
  GET_BLOG_SUCCESSFULLY: 'Get Blog successfully',
  GET_ALL_BLOG_SUCCESSFULLY: 'Get All Blog successfully',
  GET_ALL_BLOG_BY_USER_ID_SUCCESSFULLY: 'Get All Blog By User Id successfully',
  GET_ALL_BLOG_OTHER_SUCCESSFULLY: 'Get All Blog Other successfully',
  CONTENT_MUST_BE_AN_ARRAY: 'Content must be an array',
  CONTENT_EXCEED_LIMIT: 'You can upload a maximum of 5 images.',
  CONTENT_MUST_BE_AN_ARRAY_OF_MEDIA: 'Content must be an array of media',
  INVALID_TOPIC: 'Invalid topic'
} as const

export const PROVINCE_MESSAGES = {
  CREATE_PROVINCE_SUCCESSFULLY: 'Create province successfully',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_60: 'Name lenth must be from 1 to 60',
  IMG_IS_REQUIRED: 'Image is required',
  IMG_MUST_BE_A_STRING: 'Image must be a string',
  LICENSE_PLATE: 'Value must be a number',
  GET_ALL_PROVINCE_SUCCESSFULLY: 'Get all province successfully',
  INVALID_PROVINCE_ID: 'Invalid province id',
  VALUE_IS_NUMBER: 'Value is number',
  GET_PROVINCE_DETAIL_SUCCESSFULLY: 'Get province detail successfully',
  PROVINCE_NOT_FOUND: 'Province not found',
  IMG_MUST_BE_A_VALID_IMAGE_URL: 'Image must be a valid image url'
} as const

export const BOOKMARK_MESSAGES = {
  BOOKMARK_SUCCESSFULLY: 'Bookmark successfully',
  UNBOOKMARK_SUCCESSFULLY: 'Unbookmark successfully'
} as const

export const LIKE_MESSAGES = {
  LIKE_SUCCESSFULLY: 'Like successfully',
  UNLIKE_SUCCESSFULLY: 'Unlike successfully',
  GET_LIKES_SUCCESSFULLY: 'Get likes successfully'
} as const

export const MEDIA_MESSAGES = {
  UPLOAD_SUCCESSFULLY: 'Upload successfully'
}

export const HASHTAG_MESSAGES = {
  GET_ALL_HASHTAG_SUCCESSFULLY: 'Get all hashtag successfully'
}

export const CONVERSATIONS_MESSAGES = {
  GET_CONVERSATIONS_SUCCESSFULLY: 'Get conversations successfully'
}

export const COMMENTS_MESSAGES = {
  GET_COMMENTS_SUCCESSFULLY: 'Get comments successfully',
  CREATE_COMMENT_SUCCESSFULLY: 'Comment message successfully',
  REPLY_COMMENT_SUCCESSFULLY: 'Reply comment successfully'
}

export const SEARCH_MESSAGES = {
  SEARCH_SUCCESSFULLY: 'Search successfully',
  CONTENT_MUST_BE_A_STRING: 'Content must be a string'
}

export const NOTIFICATIONS_MESSAGES = {
  GET_NOTIFICATIONS_SUCCESSFULLY: 'Get notifications successfully',
  MARKED_NOTIFICATIONS_AS_READ: 'Marked notification as read',
  GET_UNREAD_NOTIFICATIONS_SUCCESSFULLY: 'Get unread notifications successfully'
}

export const CLASSES_MESSAGES = {
  CREATE_CLASS_SUCCESS: 'Create class success',
  GET_CLASSES_SUCCESS: 'Get classes success',
  GET_CLASS_DETAIL_SUCCESS: 'Get class detail success',
  UPDATE_CLASS_SUCCESS: 'Update class success',
  DELETE_CLASS_SUCCESS: 'Delete class success',
  CLASS_NOT_FOUND: 'Class not found'
} as const

export const GRADE_MESSAGES = {
  CREATE_GRADE_SUCCESS: 'Create grade success',
  GET_GRADES_SUCCESS: 'Get grades success',
  GET_GRADE_DETAIL_SUCCESS: 'Get grade detail success',
  UPDATE_GRADE_SUCCESS: 'Update grade success',
  DELETE_GRADE_SUCCESS: 'Delete grade success',
  GRADE_NOT_FOUND: 'Grade not found'
} as const

export const SCHOOL_MESSAGES = {
  CREATE_SCHOOL_SUCCESS: 'Create school success',
  GET_SCHOOLS_SUCCESS: 'Get schools success',
  GET_SCHOOL_DETAIL_SUCCESS: 'Get school detail success',
  UPDATE_SCHOOL_SUCCESS: 'Update school success',
  DELETE_SCHOOL_SUCCESS: 'Delete school success',
  SCHOOL_NOT_FOUND: 'School not found'
} as const

export const ACADEMIC_YEAR_MESSAGES = {
  CREATE_ACADEMIC_YEAR_SUCCESS: 'Create academic year success',
  GET_ACADEMIC_YEARS_SUCCESS: 'Get academic years success',
  GET_ACADEMIC_YEAR_DETAIL_SUCCESS: 'Get academic year detail success',
  UPDATE_ACADEMIC_YEAR_SUCCESS: 'Update academic year success',
  DELETE_ACADEMIC_YEAR_SUCCESS: 'Delete academic year success',
  ACADEMIC_YEAR_NOT_FOUND: 'Academic year not found'
} as const

export const STUDENT_MESSAGES = {
  CREATE_STUDENT_SUCCESS: 'Create student success',
  GET_STUDENTS_SUCCESS: 'Get students success',
  GET_STUDENT_DETAIL_SUCCESS: 'Get student detail success',
  UPDATE_STUDENT_SUCCESS: 'Update student success',
  DELETE_STUDENT_SUCCESS: 'Delete student success',
  STUDENT_NOT_FOUND: 'Student not found',
  STUDENT_CODE_EXISTED: 'Student code existed'
} as const

export const PARENT_MESSAGES = {
  CREATE_PARENT_SUCCESS: 'Create parent success',
  GET_PARENTS_SUCCESS: 'Get parents success',
  GET_PARENT_DETAIL_SUCCESS: 'Get parent detail success',
  UPDATE_PARENT_SUCCESS: 'Update parent success',
  DELETE_PARENT_SUCCESS: 'Delete parent success',
  PARENT_NOT_FOUND: 'Parent not found'
} as const

export const TEACHER_MESSAGES = {
  CREATE_TEACHER_SUCCESS: 'Create teacher success',
  GET_TEACHERS_SUCCESS: 'Get teachers success',
  GET_TEACHER_DETAIL_SUCCESS: 'Get teacher detail success',
  UPDATE_TEACHER_SUCCESS: 'Update teacher success',
  DELETE_TEACHER_SUCCESS: 'Delete teacher success',
  TEACHER_NOT_FOUND: 'Teacher not found'
} as const

export const SUBJECT_MESSAGES = {
  CREATE_SUBJECT_SUCCESS: 'Create subject success',
  GET_SUBJECTS_SUCCESS: 'Get subjects success',
  GET_SUBJECT_DETAIL_SUCCESS: 'Get subject detail success',
  UPDATE_SUBJECT_SUCCESS: 'Update subject success',
  DELETE_SUBJECT_SUCCESS: 'Delete subject success',
  SUBJECT_NOT_FOUND: 'Subject not found',
  SUBJECT_CODE_EXISTED: 'Subject code existed'
} as const

export const TIMETABLE_MESSAGES = {
  CREATE_TIMETABLE_SUCCESS: 'Create timetable success',
  GET_TIMETABLES_SUCCESS: 'Get timetables success',
  GET_TIMETABLE_DETAIL_SUCCESS: 'Get timetable detail success',
  UPDATE_TIMETABLE_SUCCESS: 'Update timetable success',
  DELETE_TIMETABLE_SUCCESS: 'Delete timetable success',
  TIMETABLE_NOT_FOUND: 'Timetable not found'
} as const

export const ATTENDANCE_MESSAGES = {
  CREATE_SESSION_SUCCESS: 'Create attendance session success',
  GET_SESSIONS_SUCCESS: 'Get attendance sessions success',
  GET_SESSION_DETAIL_SUCCESS: 'Get attendance session detail success',
  UPDATE_SESSION_SUCCESS: 'Update attendance session success',
  DELETE_SESSION_SUCCESS: 'Delete attendance session success',
  SESSION_NOT_FOUND: 'Attendance session not found',
  MARK_ATTENDANCE_SUCCESS: 'Mark attendance success',
  GET_ATTENDANCE_REPORT_SUCCESS: 'Get attendance report success',
  GET_RECORDS_SUCCESS: 'Get attendance records success'
} as const

export const FINANCIAL_MESSAGES = {
  CREATE_FEE_STRUCTURE_SUCCESS: 'Create fee structure success',
  GET_FEE_STRUCTURES_SUCCESS: 'Get fee structures success',
  GET_FEE_STRUCTURE_DETAIL_SUCCESS: 'Get fee structure detail success',
  UPDATE_FEE_STRUCTURE_SUCCESS: 'Update fee structure success',
  DELETE_FEE_STRUCTURE_SUCCESS: 'Delete fee structure success',
  FEE_STRUCTURE_NOT_FOUND: 'Fee structure not found',

  CREATE_INVOICE_SUCCESS: 'Create invoice success',
  GET_INVOICES_SUCCESS: 'Get invoices success',
  GET_INVOICE_DETAIL_SUCCESS: 'Get invoice detail success',
  UPDATE_INVOICE_SUCCESS: 'Update invoice success',
  DELETE_INVOICE_SUCCESS: 'Delete invoice success',
  INVOICE_NOT_FOUND: 'Invoice not found'
} as const

export const AUDIT_MESSAGES = {
  GET_LOGS_SUCCESS: 'Get audit logs success'
} as const

export const TEACHING_ASSIGNMENT_MESSAGES = {
  CREATE_ASSIGNMENT_SUCCESS: 'Create teaching assignment success',
  GET_ASSIGNMENTS_SUCCESS: 'Get teaching assignments success',
  GET_ASSIGNMENT_DETAIL_SUCCESS: 'Get teaching assignment detail success',
  UPDATE_ASSIGNMENT_SUCCESS: 'Update teaching assignment success',
  DELETE_ASSIGNMENT_SUCCESS: 'Delete teaching assignment success',
  ASSIGNMENT_NOT_FOUND: 'Teaching assignment not found'
} as const

export const ROLE_MESSAGES = {
  CREATE_ROLE_SUCCESS: 'Create role success',
  GET_ROLES_SUCCESS: 'Get roles success',
  GET_ROLE_DETAIL_SUCCESS: 'Get role detail success',
  UPDATE_ROLE_SUCCESS: 'Update role success',
  DELETE_ROLE_SUCCESS: 'Delete role success',
  ROLE_NOT_FOUND: 'Role not found'
} as const

export const PERMISSION_MESSAGES = {
  CREATE_PERMISSION_SUCCESS: 'Create permission success',
  GET_PERMISSIONS_SUCCESS: 'Get permissions success',
  GET_PERMISSION_DETAIL_SUCCESS: 'Get permission detail success',
  UPDATE_PERMISSION_SUCCESS: 'Update permission success',
  DELETE_PERMISSION_SUCCESS: 'Delete permission success',
  PERMISSION_NOT_FOUND: 'Permission not found'
} as const

export const JOIN_REQUEST_MESSAGES = {
  CREATE_JOIN_REQUEST_SUCCESS: 'Join request submitted successfully',
  GET_JOIN_REQUESTS_SUCCESS: 'Get join requests success',
  APPROVE_JOIN_REQUEST_SUCCESS: 'Join request approved successfully',
  REJECT_JOIN_REQUEST_SUCCESS: 'Join request rejected',
  JOIN_REQUEST_NOT_FOUND: 'Join request not found',
  JOIN_REQUEST_ALREADY_PROCESSED: 'Join request already processed',
  INVALID_LINK_CODE: 'Invalid link code',
  CLASS_NOT_FOUND: 'Class not found',
  ALREADY_REQUESTED: 'You have already requested to join this class',
  ALREADY_IN_CLASS: 'You are already a student in this class'
} as const
