import { Router } from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/data-source'
import { User } from '../entities/User'
import { authGuard, requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { toPublicUser } from '../utils/serializers'

const userCreateSchema = z.object({
  fullname: z.string().min(2).max(160),
  username: z.string().min(3).max(80),
  password: z.string().min(8).max(100),
  role: z.enum(['admin', 'user']).default('user'),
})

const userUpdateSchema = userCreateSchema.partial()

export const usersRouter = Router()

usersRouter.use(authGuard)

usersRouter.get('/', async (_req, res) => {
  const users = await AppDataSource.getRepository(User).find({
    select: ['id', 'fullname', 'username', 'role', 'createdAt', 'updatedAt'],
    order: { createdAt: 'DESC' },
  })

  return res.json(users.map(toPublicUser))
})

usersRouter.post('/', requireRole('admin'), validateBody(userCreateSchema), async (req, res) => {
  const users = AppDataSource.getRepository(User)
  const exists = await users.exists({ where: { username: req.body.username } })

  if (exists) {
    return res.status(409).json({ message: 'Username already exists' })
  }

  const user = users.create({
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  })
  const saved = await users.save(user)

  return res.status(201).json(toPublicUser(saved))
})

usersRouter.get('/:id', async (req, res) => {
  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: Number(req.params.id) },
    select: ['id', 'fullname', 'username', 'role', 'createdAt', 'updatedAt'],
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.json(toPublicUser(user))
})

usersRouter.patch('/:id', requireRole('admin'), validateBody(userUpdateSchema), async (req, res) => {
  const users = AppDataSource.getRepository(User)
  const user = await users.findOne({ where: { id: Number(req.params.id) } })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (req.body.username && req.body.username !== user.username) {
    const exists = await users.exists({ where: { username: req.body.username } })
    if (exists) {
      return res.status(409).json({ message: 'Username already exists' })
    }
  }

  users.merge(user, req.body)
  const saved = await users.save(user)

  return res.json(toPublicUser(saved))
})

usersRouter.delete('/:id', requireRole('admin'), async (req, res) => {
  const users = AppDataSource.getRepository(User)
  const id = Number(req.params.id)

  if (req.user?.id === id) {
    return res.status(400).json({ message: 'Admin cannot delete the current authenticated user' })
  }

  const result = await users.delete(id)

  if (!result.affected) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.status(204).send()
})
