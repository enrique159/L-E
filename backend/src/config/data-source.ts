import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from './env'
import { Guest } from '../entities/Guest'
import { User } from '../entities/User'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  // Este proyecto administra el esquema directamente con TypeORM en todos los entornos.
  synchronize: true,
  logging: env.db.logging,
  entities: [User, Guest],
})
