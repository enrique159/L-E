import cors from 'cors'
import express from 'express'
import { authRouter } from './routes/auth.routes'
import { guestsRouter } from './routes/guests.routes'
import { usersRouter } from './routes/users.routes'
import { errorHandler } from './middleware/error-handler'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  return res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/guests', guestsRouter)

app.use(errorHandler)
