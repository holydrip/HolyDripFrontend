import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { PrismaService } from './database/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers (XSS, clickjacking, MIME-sniffing protection)
  app.use(helmet());

  // CORS — only allow requests from our frontend domain
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://holydrip.com.ua',
    'https://www.holydrip.com.ua'
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(allowed => origin.startsWith(allowed!))) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
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


  // Auto-cleanup any product names with leading/trailing whitespace
  try {
    const prisma = app.get(PrismaService);
    const products = await prisma.product.findMany();
    for (const p of products) {
      if (p.name && p.name !== p.name.trim()) {
        await prisma.product.update({
          where: { id: p.id },
          data: { name: p.name.trim() }
        });
      }
    }
  } catch (err) {
    console.error('Failed to cleanup product names:', err);
  }

  await app.listen(process.env.PORT ?? 8800, '0.0.0.0');
}
bootstrap();

