import { AppDataSource } from './config/data-source'
import { env } from './config/env'
import { app } from './app'
import { seedDefaultAdmin } from './services/seed'

async function bootstrap() {
  await AppDataSource.initialize()
  await seedDefaultAdmin()

  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`)
  })
}

bootstrap().catch((error) => {
  console.error('Failed to start API', error)
  process.exit(1)
})
