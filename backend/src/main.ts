import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // Enable CORS — CORS_ORIGIN can be comma-separated for multiple origins
  // e.g. CORS_ORIGIN=https://app.vercel.app,http://localhost:3000
  const rawOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000'
  const corsOrigins = rawOrigin.split(',').map(o => o.trim())
  app.enableCors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
    credentials: true,
  })
  
  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  
  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 Application is running on: http://localhost:${port}`)
}
bootstrap()
