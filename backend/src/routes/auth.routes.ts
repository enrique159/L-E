import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { AppDataSource } from '../config/data-source'
import { env } from '../config/env'
import { User } from '../entities/User'
import { authGuard, AuthTokenPayload } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { toPublicUser } from '../utils/serializers'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const authRouter = Router()

authRouter.post('/login', validateBody(loginSchema), async (req, res) => {
  const { username, password } = req.body
  const user = await AppDataSource.getRepository(User).findOne({ where: { username } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const payload: AuthTokenPayload = {
    sub: user.id,
    username: user.username,
    role: user.role,
  }

  const token = jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  })

  return res.json({
    token,
    user: toPublicUser(user),
  })
})

authRouter.get('/me', authGuard, (req, res) => {
  return res.json({ user: req.user })
})
