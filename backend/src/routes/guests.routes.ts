import { Router } from 'express'
import { z } from 'zod'
import { AppDataSource } from '../config/data-source'
import { Guest } from '../entities/Guest'
import { authGuard } from '../middleware/auth'
import { validateBody } from '../middleware/validate'
import { toPublicGuest } from '../utils/serializers'

const guestCreateSchema = z.object({
  name: z.string().min(1).max(120),
  surname: z.string().min(1).max(120),
  phone: z.string().max(30).nullable().optional(),
  email: z.string().email().max(160).nullable().optional(),
  relationship: z.string().max(120).nullable().optional(),
  priority: z.number().int().min(0).default(0),
  group: z.string().max(120).nullable().optional(),
  notes: z.string().nullable().optional(),
  already_invited: z.boolean().default(false),
})

const guestUpdateSchema = guestCreateSchema.partial()

export const guestsRouter = Router()

guestsRouter.use(authGuard)

guestsRouter.get('/', async (req, res) => {
  const { already_invited: alreadyInvited, group, priority } = req.query
  const guests = await AppDataSource.getRepository(Guest).find({
    where: {
      ...(alreadyInvited !== undefined ? { alreadyInvited: alreadyInvited === 'true' } : {}),
      ...(typeof group === 'string' ? { group } : {}),
      ...(priority !== undefined ? { priority: Number(priority) } : {}),
    },
    order: { priority: 'DESC', createdAt: 'DESC' },
  })

  return res.json(guests.map(toPublicGuest))
})

guestsRouter.post('/', validateBody(guestCreateSchema), async (req, res) => {
  const guests = AppDataSource.getRepository(Guest)
  const guest = guests.create(toGuestPayload(req.body))
  const saved = await guests.save(guest)

  return res.status(201).json(toPublicGuest(saved))
})

guestsRouter.get('/:id', async (req, res) => {
  const guest = await AppDataSource.getRepository(Guest).findOne({
    where: { id: Number(req.params.id) },
  })

  if (!guest) {
    return res.status(404).json({ message: 'Guest not found' })
  }

  return res.json(toPublicGuest(guest))
})

guestsRouter.patch('/:id', validateBody(guestUpdateSchema), async (req, res) => {
  const guests = AppDataSource.getRepository(Guest)
  const guest = await guests.findOne({ where: { id: Number(req.params.id) } })

  if (!guest) {
    return res.status(404).json({ message: 'Guest not found' })
  }

  guests.merge(guest, toGuestPayload(req.body))
  const saved = await guests.save(guest)

  return res.json(toPublicGuest(saved))
})

guestsRouter.delete('/:id', async (req, res) => {
  const result = await AppDataSource.getRepository(Guest).delete(Number(req.params.id))

  if (!result.affected) {
    return res.status(404).json({ message: 'Guest not found' })
  }

  return res.status(204).send()
})

function toGuestPayload(body: z.infer<typeof guestUpdateSchema>) {
  const { already_invited: alreadyInvited, ...rest } = body

  return {
    ...rest,
    ...(alreadyInvited !== undefined ? { alreadyInvited } : {}),
  }
}
