import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import invitationsRouter from './routes/invitations.router'
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
