import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const PORT = process.env.PORT || 4202
  const apiPrefix = process.env.API_PREFIX
  const app = await NestFactory.create(AppModule)
  
  app.setGlobalPrefix(apiPrefix)

  app.enableShutdownHooks()

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('TMS API')
    .setDescription('Treasury Management System REST API docs')
    .setVersion('1.1.0')
    .addTag('REST API')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document)

  await app.listen(PORT)
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}...`.yellow.bold)
}
;(async () => bootstrap())()
