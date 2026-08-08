import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = `Duplicate entry: ${exception.meta?.target}`;
        break;
      case 'P2003':
        statusCode = HttpStatus.BAD_REQUEST;
        message = `Invalid reference in: ${exception.meta?.field_name}`;
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      default:
        console.error('Unhandled Prisma Error:', exception);
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: 'Database error',
    });
  }
}
