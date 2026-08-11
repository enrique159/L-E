import cors from 'cors'
import express from 'express'
import { env } from './config/env'
import { authRouter } from './routes/auth.routes'
import { guestsRouter } from './routes/guests.routes'
import { rsvpsRouter } from './routes/rsvps.routes'
import { usersRouter } from './routes/users.routes'
import { errorHandler } from './middleware/error-handler'

export const app = express()

app.use(
  cors({
    origin(origin, callback) {
      const allowed =
        !origin || env.nodeEnv !== 'production' || env.corsOrigins.includes(origin)
      callback(null, allowed)
    },
  }),
)
app.use(express.json())
app.use((req, res, next) => {
  const startedAt = Date.now()
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`)
  })
  next()
})

app.get('/health', (_req, res) => {
  return res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/guests', guestsRouter)
app.use('/api/rsvps', rsvpsRouter)

app.use(errorHandler)
