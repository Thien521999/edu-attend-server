import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import academicYearsRouter from './routes/academicYears.router'
import attendancesRouter from './routes/attendances.router'
import auditLogsRouter from './routes/auditLogs.router'
import classesRouter from './routes/classes.router'
import financialRouter from './routes/financial.router'
import gradesRouter from './routes/grades.router'
import invitationsRouter from './routes/invitations.router'
import parentsRouter from './routes/parents.router'
import permissionsRouter from './routes/permissions.router'
import rolesRouter from './routes/roles.router'
import schoolsRouter from './routes/schools.router'
import studentsRouter from './routes/students.router'
import subjectsRouter from './routes/subjects.router'
import teachersRouter from './routes/teachers.router'
import teachingAssignmentsRouter from './routes/teachingAssignments.router'
import timetablesRouter from './routes/timetables.router'
import usersRouter from './routes/users.router'
import databaseService from './services/database.services'
import { seedDatabase } from './utils/database.seeder'
// import initSocket from './utils/socket'
// import { Server } from 'socket.io'
// import { initSocket } from './utils/initSocket'
// import admin from 'firebase-admin'
// import serviceAccount from '../firbaseConfig.json'

dotenv.config()

// config firebase
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
// })

// console.log(UPLOAD_IMAGE_DIR)
// console.log(process.argv)

// Tạo folder upload
// initFolder()

databaseService.connect().then(async () => {
  await Promise.all([databaseService.indexUsers(), databaseService.indexRefreshTokens()])
  // await databaseService.indexRBAC()
  await seedDatabase()
})

const corsOptions = {
  origin: '*', // Replace with the allowed origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express()
const httpServer = createServer(app)

const port = process.env.PORT || 4000
app.use(cors(corsOptions))
app.use(express.json())
// middlewares
app.use('/users', usersRouter)
app.use('/invitations', invitationsRouter)
app.use('/classes', classesRouter)
app.use('/grades', gradesRouter)
app.use('/schools', schoolsRouter)
app.use('/academic-years', academicYearsRouter)
app.use('/students', studentsRouter)
app.use('/parents', parentsRouter)
app.use('/teachers', teachersRouter)
app.use('/subjects', subjectsRouter)
app.use('/timetables', timetablesRouter)
app.use('/teaching-assignments', teachingAssignmentsRouter)
app.use('/attendances', attendancesRouter)
app.use('/financial', financialRouter)
app.use('/audit-logs', auditLogsRouter)
app.use('/roles', rolesRouter)
app.use('/permissions', permissionsRouter)

// cron.schedule("* * * * *", async()=> {
//   await
// })

app.use('/test', (req, res) => {
  res.send('This is a test endpoint.')
})

app.use(defaultErrorHandler)

// initSocket(httpServer)
// initSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
