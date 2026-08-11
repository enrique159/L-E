import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/data-source'
import { env } from '../config/env'
import { User, UserRole } from '../entities/User'

export type AuthTokenPayload = {
  sub: number
  username: string
  role: UserRole
}

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>
    }
  }
}

export async function authGuard(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing bearer token' })
  }

  try {
    const token = header.slice('Bearer '.length)
    const payload = jwt.verify(token, env.jwtSecret) as unknown as AuthTokenPayload
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: payload.sub },
      select: ['id', 'fullname', 'username', 'role', 'createdAt', 'updatedAt'],
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid token user' })
    }

    req.user = user
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    return next()
  }
}
