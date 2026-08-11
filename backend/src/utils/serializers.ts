import { Guest } from '../entities/Guest'
import { User } from '../entities/User'

export function toPublicUser(user: User) {
  return {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    role: user.role,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  }
}

export function toPublicGuest(guest: Guest) {
  return {
    id: guest.id,
    name: guest.name,
    surname: guest.surname,
    phone: guest.phone,
    email: guest.email,
    relationship: guest.relationship,
    priority: guest.priority,
    group: guest.group,
    notes: guest.notes,
    already_invited: guest.alreadyInvited,
    created_at: guest.createdAt,
    updated_at: guest.updatedAt,
  }
}
