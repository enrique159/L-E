import { Router } from 'express'
import { QueryFailedError } from 'typeorm'
import { z } from 'zod'
import { AppDataSource } from '../config/data-source'
import { Rsvp } from '../entities/Rsvp'
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

function isDuplicateEntry(error: unknown) {
  if (!(error instanceof QueryFailedError)) return false

  const driverError = error.driverError as { code?: string; errno?: number }
  return driverError.code === 'ER_DUP_ENTRY' || driverError.errno === 1062
}
