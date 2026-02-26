import { config } from 'dotenv'
import { Collection, Db, MongoClient } from 'mongodb'
import Permission from '~/models/schemas/Permission.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Role from '~/models/schemas/Role.schema'
import RolePermission from '~/models/schemas/RolePermission.schema'
import User from '~/models/schemas/User.schema'
import UserRole from '~/models/schemas/UserRole.schema'
import Invitation from '~/models/schemas/Invitation.schema'
import Class from '~/models/schemas/Class.schema'
import Grade from '~/models/schemas/Grade.schema'
import School from '~/models/schemas/School.schema'
import AcademicYear from '~/models/schemas/AcademicYear.schema'
import Student from '~/models/schemas/Student.schema'
import Parent from '~/models/schemas/Parent.schema'
import Teacher from '~/models/schemas/Teacher.schema'
import Subject from '~/models/schemas/Subject.schema'
import Timetable from '~/models/schemas/Timetable.schema'
import TeachingAssignment from '~/models/schemas/TeachingAssignment.schema'
import AttendanceSession from '~/models/schemas/AttendanceSession.schema'
import AttendanceRecord from '~/models/schemas/AttendanceRecord.schema'
import FeeStructure from '~/models/schemas/FeeStructure.schema'
import TuitionFee from '~/models/schemas/TuitionFee.schema'
import TuitionInvoice from '~/models/schemas/TuitionInvoice.schema'
import AuditLog from '~/models/schemas/AuditLog.schema'
import StudentParent from '~/models/schemas/StudentParent.schema'
import ClassJoinRequest from '~/models/schemas/ClassJoinRequest.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@edu-attend-dev.yjtpovp.mongodb.net/?appName=edu-attend-dev`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('error??', error)
      throw error
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1'])
    if (!exists) {
      await Promise.all([
        this.users.createIndex({ email: 1, password: 1 }),
        this.users.createIndex({ email: 1 }, { unique: true })
      ])
    }
  }

  async indexRefreshTokens() {
    const exists = await this.refreshToken.indexExists(['token_1', 'exp_1'])
    if (!exists) {
      await Promise.all([
        this.refreshToken.createIndex({ token: 1 }),
        this.refreshToken.createIndex(
          { exp: 1 },
          { expireAfterSeconds: 0 } // dựa vaò mốc thời gian là exp, cũ quá thì mongoDB tự xoá
        )
      ])
    }
  }

  async indexParents() {
    const exists = await this.parents.indexExists(['student_id_1_parent_id_1'])
    if (!exists) {
      await Promise.all([this.parents.createIndex({ student_id: 1, parent_id: 1 })])
    }
  }

  async indexClassJoinRequests() {
    const exists = await this.classJoinRequests.indexExists(['user_id_1_class_id_1', 'link_code_1', 'owner_id_1'])
    if (!exists) {
      await Promise.all([
        this.classJoinRequests.createIndex({ user_id: 1, class_id: 1 }),
        this.classJoinRequests.createIndex({ link_code: 1 }, { unique: true }),
        this.classJoinRequests.createIndex({ owner_id: 1 }, { unique: true })
      ])
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get roles(): Collection<Role> {
    return this.db.collection(process.env.DB_ROLES_COLLECTION as string)
  }

  get permissions(): Collection<Permission> {
    return this.db.collection(process.env.DB_PERMISSIONS_COLLECTION as string)
  }

  get rolePermissions(): Collection<RolePermission> {
    return this.db.collection(process.env.DB_ROLE_PERMISSIONS_COLLECTION as string)
  }

  get userRoles(): Collection<UserRole> {
    return this.db.collection(process.env.DB_USER_ROLES_COLLECTION as string)
  }

  get invitations(): Collection<Invitation> {
    return this.db.collection(process.env.DB_INVITATIONS_COLLECTION as string)
  }

  get classes(): Collection<Class> {
    return this.db.collection(process.env.DB_CLASSES_COLLECTION as string)
  }

  get grades(): Collection<Grade> {
    return this.db.collection(process.env.DB_GRADES_COLLECTION as string)
  }

  get schools(): Collection<School> {
    return this.db.collection(process.env.DB_SCHOOLS_COLLECTION as string)
  }

  get academicYears(): Collection<AcademicYear> {
    return this.db.collection(process.env.DB_ACADEMIC_YEARS_COLLECTION as string)
  }

  get students(): Collection<Student> {
    return this.db.collection(process.env.DB_STUDENTS_COLLECTION as string)
  }

  get parents(): Collection<Parent> {
    return this.db.collection(process.env.DB_PARENTS_COLLECTION as string)
  }

  get teachers(): Collection<Teacher> {
    return this.db.collection(process.env.DB_TEACHERS_COLLECTION as string)
  }

  get subjects(): Collection<Subject> {
    return this.db.collection(process.env.DB_SUBJECTS_COLLECTION as string)
  }

  get timetables(): Collection<Timetable> {
    return this.db.collection(process.env.DB_TIMETABLES_COLLECTION as string)
  }

  get teachingAssignments(): Collection<TeachingAssignment> {
    return this.db.collection(process.env.DB_TEACHING_ASSIGNMENTS_COLLECTION as string)
  }

  get attendanceSessions(): Collection<AttendanceSession> {
    return this.db.collection(process.env.DB_ATTENDANCE_SESSIONS_COLLECTION as string)
  }

  get attendanceRecords(): Collection<AttendanceRecord> {
    return this.db.collection(process.env.DB_ATTENDANCE_RECORDS_COLLECTION as string)
  }

  get feeStructures(): Collection<FeeStructure> {
    return this.db.collection(process.env.DB_FEE_STRUCTURES_COLLECTION as string)
  }

  get tuitionFees(): Collection<TuitionFee> {
    return this.db.collection(process.env.DB_TUITION_FEES_COLLECTION as string)
  }

  get tuitionInvoices(): Collection<TuitionInvoice> {
    return this.db.collection(process.env.DB_TUITION_INVOICES_COLLECTION as string)
  }

  get auditLogs(): Collection<AuditLog> {
    return this.db.collection(process.env.DB_AUDIT_LOGS_COLLECTION as string)
  }

  get studentParents(): Collection<StudentParent> {
    return this.db.collection(process.env.DB_STUDENT_PARENTS_COLLECTION as string)
  }

  get classJoinRequests(): Collection<ClassJoinRequest> {
    return this.db.collection(process.env.DB_CLASS_JOIN_REQUESTS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
