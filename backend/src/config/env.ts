import dotenv from 'dotenv'

dotenv.config()

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3333),
  jwtSecret: process.env.JWT_SECRET ?? 'change-me-before-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  seedAdmin: {
    fullname: process.env.ADMIN_FULLNAME ?? 'Administrador',
    username: process.env.ADMIN_USERNAME ?? 'admin',
    password: process.env.ADMIN_PASSWORD,
  },
  db: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'wedding_invite',
    logging: process.env.DB_LOGGING === 'true',
  },
}
