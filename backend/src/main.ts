import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  const port = process.env.PORT ?? 8800;
  console.log('Starting on port:', port);

  const config = new DocumentBuilder()
    .setTitle('Holy-drip eCommerce shop API')
    .setDescription(
      'API for managing products, orders, users, and authentication',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/api', app, document);

  await app.listen(process.env.PORT ?? 8800, '0.0.0.0');
}
bootstrap();
