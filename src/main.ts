import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setDescription('API de gestión de Ordenes')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(`API lista en      http://localhost:${port}/orders`, 'Bootstrap');
  Logger.log(`Swagger UI en     http://localhost:${port}/docs`, 'Bootstrap');
}
await bootstrap();
