import { AppDataSource } from '../config/data-source'
import { env } from '../config/env'
import { User } from '../entities/User'

export async function seedDefaultAdmin() {
  const users = AppDataSource.getRepository(User)
  const existingAdmin = await users.findOne({ where: { username: env.seedAdmin.username } })

  if (existingAdmin) {
    return
  }

  if (!env.seedAdmin.password) {
    console.warn('ADMIN_PASSWORD no está configurada; no se creó el usuario administrador inicial.')
    return
  }

  const admin = users.create({
    fullname: env.seedAdmin.fullname,
    username: env.seedAdmin.username,
    password: env.seedAdmin.password,
    role: 'admin',
  })

  await users.save(admin)
}
