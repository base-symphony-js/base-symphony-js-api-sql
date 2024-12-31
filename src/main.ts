import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { PORT, SERVER_URL_NAME } from '@common'
import morgan from 'morgan'

async function bootstrap() {
  const logger = new Logger('Main')

  const app = await NestFactory.create(AppModule)

  app.use(
    '/',
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: {
        write: message => logger.log(message.trim()),
      },
    }),
  )

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Base Symphony JS')
    .setDescription('The API description')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api-docs', app, document)

  app.enableCors()
  await app.listen(PORT ?? 3000)
  logger.log(`Server running on ${SERVER_URL_NAME}`)
}

bootstrap()
