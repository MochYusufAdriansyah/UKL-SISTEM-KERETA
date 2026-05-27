import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

export function prismaErrors(error: unknown): Promise<unknown> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P1000':
        throw new HttpException(
          {
            success: false,
            message: 'Invalid database credentials',
            data: null,
            error: 'DATABASE',
          },
          HttpStatus.UNAUTHORIZED,
        );

      case 'P1001':
        throw new HttpException(
          {
            success: false,
            message: 'Database not reachable',
            data: null,
            error: 'DATABASE',
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );

      case 'P1002':
        throw new HttpException(
          {
            success: false,
            message: 'Database timeout',
            data: null,
            error: 'DATABASE',
          },
          HttpStatus.GATEWAY_TIMEOUT,
        );

      case 'P1003':
        throw new HttpException(
          {
            success: false,
            message: 'Database not found',
            data: null,
            error: 'DATABASE',
          },
          HttpStatus.NOT_FOUND,
        );

      case 'P1008':
        throw new HttpException(
          {
            success: false,
            message: 'Query timeout',
            data: null,
            error: 'DATABASE',
          },
          HttpStatus.GATEWAY_TIMEOUT,
        );

      case 'P1010':
        throw new HttpException(
          {
            success: false,
            message: 'Database access denied',
            data: null,
            error: 'DATABASE',
          },
          HttpStatus.FORBIDDEN,
        );

      case 'P1017':
        throw new HttpException(
          {
            success: false,
            message: 'Database connection closed',
            data: null,
            error: 'DATABASE',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      case 'P2000':
        throw new HttpException(
          {
            success: false,
            message: 'Value too long',
            data: null,
            error: 'VALIDATION',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2001':
      case 'P2025':
        throw new HttpException(
          {
            success: false,
            message: 'Data not found',
            data: null,
            error: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );

      case 'P2002':
        throw new HttpException(
          {
            success: false,
            message: 'Data already exists',
            data: null,
            error: 'CONFLICT',
          },
          HttpStatus.CONFLICT,
        );

      case 'P2003':
        throw new HttpException(
          {
            success: false,
            message: 'Foreign key constraint failed',
            data: null,
            error: 'CONSTRAINT',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2004':
        throw new HttpException(
          {
            success: false,
            message: 'Constraint failed',
            data: null,
            error: 'CONSTRAINT',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2005':
      case 'P2006':
      case 'P2007':
        throw new HttpException(
          {
            success: false,
            message: 'Invalid data',
            data: null,
            error: 'VALIDATION',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2008':
      case 'P2009':
        throw new HttpException(
          {
            success: false,
            message: 'Query error',
            data: null,
            error: 'QUERY',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2010':
        throw new HttpException(
          {
            success: false,
            message: 'Raw query failed',
            data: null,
            error: 'QUERY',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2011':
        throw new HttpException(
          {
            success: false,
            message: 'Null constraint violation',
            data: null,
            error: 'VALIDATION',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2012':
      case 'P2013':
        throw new HttpException(
          {
            success: false,
            message: 'Missing required data',
            data: null,
            error: 'VALIDATION',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2014':
      case 'P2017':
        throw new HttpException(
          {
            success: false,
            message: 'Relation error',
            data: null,
            error: 'CONSTRAINT',
          },
          HttpStatus.BAD_REQUEST,
        );

      case 'P2015':
        throw new HttpException(
          {
            success: false,
            message: 'Related data not found',
            data: null,
            error: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );

      case 'P2016':
        throw new HttpException(
          {
            success: false,
            message: 'Query interpretation error',
            data: null,
            error: 'QUERY',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      case 'P2028':
        throw new HttpException(
          {
            success: false,
            message: 'Transaction failed',
            data: null,
            error: 'TRANSACTION',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      case 'P2034':
        throw new HttpException(
          {
            success: false,
            message: 'Deadlock detected',
            data: null,
            error: 'CONFLICT',
          },
          HttpStatus.CONFLICT,
        );

      default:
        throw new HttpException(
          {
            success: false,
            message: 'Internal server error',
            data: null,
            error: 'UNKNOWN',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
  throw new HttpException(
    {
      success: false,
      message: 'Internal server error',
      data: null,
      error: 'UNKNOWN',
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
