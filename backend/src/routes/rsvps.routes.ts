import { Router } from 'express'
import { QueryFailedError } from 'typeorm'
import { z } from 'zod'
import { AppDataSource } from '../config/data-source'
import { Rsvp } from '../entities/Rsvp'
import { authGuard, requireRole } from '../middleware/auth'
import { validateBody } from '../middleware/validate'

const rsvpCreateSchema = z
  .object({
    name: z.string().trim().min(2).max(160),
    phone: z
      .string()
      .transform((value) => value.replace(/\D/g, ''))
      .refine((value) => /^\d{10}$/.test(value), 'El teléfono debe contener 10 dígitos'),
    attendance: z.enum(['yes', 'no']),
    guest_count: z.number().int().min(0).max(4),
    note: z.string().trim().max(1000).optional().default(''),
  })
  .superRefine((value, context) => {
    if (value.attendance === 'yes' && value.guest_count < 1) {
      context.addIssue({
        code: 'custom',
        path: ['guest_count'],
        message: 'Indica al menos una persona cuando confirmas asistencia',
      })
    }

    if (value.attendance === 'no' && value.guest_count !== 0) {
      context.addIssue({
        code: 'custom',
        path: ['guest_count'],
        message: 'La cantidad debe ser cero cuando no asistirás',
      })
    }
  })

const rsvpUpdateSchema = z
  .object({
    name: z.string().trim().min(2).max(160).optional(),
    phone: z
      .string()
      .transform((value) => value.replace(/\D/g, ''))
      .refine((value) => /^\d{10}$/.test(value), 'El teléfono debe contener 10 dígitos')
      .optional(),
    attendance: z.enum(['yes', 'no']).optional(),
    guest_count: z.number().int().min(0).max(4).optional(),
    note: z.string().trim().max(1000).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, 'Envía al menos un campo para actualizar')

export const rsvpsRouter = Router()

rsvpsRouter.post('/', validateBody(rsvpCreateSchema), async (req, res) => {
  const repository = AppDataSource.getRepository(Rsvp)
  const response = repository.create({
    name: req.body.name,
    phone: req.body.phone,
    attendance: req.body.attendance,
    guestCount: req.body.guest_count,
    note: req.body.note || null,
  })

  try {
    const saved = await repository.save(response)

    return res.status(201).json({
      id: saved.id,
      name: saved.name,
      attendance: saved.attendance,
      guest_count: saved.guestCount,
      created_at: saved.createdAt,
    })
  } catch (error) {
    if (isDuplicateEntry(error)) {
      return res.status(409).json({
        code: 'RSVP_PHONE_EXISTS',
        message: 'Ya existe una confirmación registrada con este teléfono.',
      })
    }

    throw error
  }
})

rsvpsRouter.use(authGuard, requireRole('admin'))

rsvpsRouter.get('/', async (_req, res) => {
  const responses = await AppDataSource.getRepository(Rsvp).find({
    order: { createdAt: 'DESC' },
  })

  return res.json(responses.map(toPublicRsvp))
})

rsvpsRouter.patch('/:id', validateBody(rsvpUpdateSchema), async (req, res) => {
  const repository = AppDataSource.getRepository(Rsvp)
  const response = await repository.findOne({ where: { id: Number(req.params.id) } })

  if (!response) {
    return res.status(404).json({ message: 'Confirmación no encontrada' })
  }

  const attendance = req.body.attendance ?? response.attendance
  const guestCount = req.body.guest_count ?? response.guestCount

  if (attendance === 'yes' && guestCount < 1) {
    return res.status(400).json({ message: 'Indica al menos una persona cuando asistirá' })
  }

  if (attendance === 'no' && guestCount !== 0) {
    return res.status(400).json({ message: 'La cantidad debe ser cero cuando no asistirá' })
  }

  repository.merge(response, {
    ...(req.body.name !== undefined ? { name: req.body.name } : {}),
    ...(req.body.phone !== undefined ? { phone: req.body.phone } : {}),
    ...(req.body.attendance !== undefined ? { attendance: req.body.attendance } : {}),
    ...(req.body.guest_count !== undefined ? { guestCount: req.body.guest_count } : {}),
    ...(req.body.note !== undefined ? { note: req.body.note || null } : {}),
  })

  try {
    return res.json(toPublicRsvp(await repository.save(response)))
  } catch (error) {
    if (isDuplicateEntry(error)) {
      return duplicatePhoneResponse(res)
    }

    throw error
  }
})

rsvpsRouter.delete('/:id', async (req, res) => {
  const result = await AppDataSource.getRepository(Rsvp).delete(Number(req.params.id))

  if (!result.affected) {
    return res.status(404).json({ message: 'Confirmación no encontrada' })
  }

  return res.status(204).send()
})

function isDuplicateEntry(error: unknown) {
  if (!(error instanceof QueryFailedError)) return false

  const driverError = error.driverError as { code?: string; errno?: number }
  return driverError.code === 'ER_DUP_ENTRY' || driverError.errno === 1062
}

function duplicatePhoneResponse(res: import('express').Response) {
  return res.status(409).json({
    code: 'RSVP_PHONE_EXISTS',
    message: 'Ya existe una confirmación registrada con este teléfono.',
  })
}

function toPublicRsvp(response: Rsvp) {
  return {
    id: response.id,
    name: response.name,
    phone: response.phone,
    attendance: response.attendance,
    guest_count: response.guestCount,
    note: response.note,
    created_at: response.createdAt,
    updated_at: response.updatedAt,
  }
}
