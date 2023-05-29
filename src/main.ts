import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Configuración de la validación global
  app.useGlobalPipes(new ValidationPipe());

  await app.setGlobalPrefix('v1');
  await app.listen(3000);
}
bootstrap();
