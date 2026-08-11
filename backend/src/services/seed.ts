import { AppDataSource } from '../config/data-source'
import { User } from '../entities/User'

export async function seedDefaultAdmin() {
  const users = AppDataSource.getRepository(User)
  const existingAdmin = await users.findOne({ where: { username: 'admin' } })

  if (existingAdmin) {
    return
  }

  const admin = users.create({
    fullname: 'Administrator',
    username: 'admin',
    password: 'Admin2026$',
    role: 'admin',
  })

  await users.save(admin)
}
