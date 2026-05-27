import { HttpException, HttpStatus } from '@nestjs/common';

type ErrorBody<T = unknown> = {
  success: false;
  code: string;
  message: string;
  timestamp: string;
  details?: T;
};

type ErrorOptions<T = unknown> = {
  message?: string;
  details?: T;
};

function createError<T = unknown>(
  status: HttpStatus,
  code: string,
  defaultMessage: string,
  options?: ErrorOptions<T>,
): HttpException {
  const body: ErrorBody<T> = {
    success: false,
    code,
    message: options?.message ?? defaultMessage,
    timestamp: new Date().toISOString(),
    details: options?.details,
  };

  return new HttpException(body, status);
}

class AppError {
  static badRequest<T>(options?: ErrorOptions<T>) {
    return createError(
      HttpStatus.BAD_REQUEST,
      'BAD_REQUEST',
      'The request could not be understood or was missing required parameters',
      options,
    );
  }

  static unauthorized<T>(p0: string, options?: ErrorOptions<T>) {
    return createError(
      HttpStatus.UNAUTHORIZED,
      'UNAUTHORIZED',
      'Authentication is required to access this resource',
      options,
    );
  }

  static forbidden<T>(options?: ErrorOptions<T>) {
    return createError(
      HttpStatus.FORBIDDEN,
      'FORBIDDEN',
      'You do not have permission to access this resource',
      options,
    );
  }

  static notFound<T>(resource: string, options?: ErrorOptions<T>) {
    return createError(
      HttpStatus.NOT_FOUND,
      'NOT_FOUND',
      `${resource} not found`,
      options,
    );
  }

  static conflict<T>(resource: string, options?: ErrorOptions<T>) {
    return createError(
      HttpStatus.CONFLICT,
      'CONFLICT',
      `${resource} already exists`,
      options,
    );
  }

  static unprocessable<T>(options?: ErrorOptions<T>) {
    return createError(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'UNPROCESSABLE_ENTITY',
      'The request was well-formed but could not be processed',
      options,
    );
  }

  static tooManyRequests<T>(options?: ErrorOptions<T>) {
    return createError(
      HttpStatus.TOO_MANY_REQUESTS,
      'TOO_MANY_REQUESTS',
      'Too many requests, please try again later',
      options,
    );
  }

  static internal<T>(options?: ErrorOptions<T>) {
    return createError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred, please try again later',
      options,
    );
  }

  static serviceUnavailable<T>(options?: ErrorOptions<T>) {
    return createError(
      HttpStatus.SERVICE_UNAVAILABLE,
      'SERVICE_UNAVAILABLE',
      'The service is temporarily unavailable, please try again later',
      options,
    );
  }

  static custom<T>(
    status: HttpStatus,
    code: string,
    options?: ErrorOptions<T>,
  ) {
    return createError(status, code, 'An error occurred', options);
  }
}

export { AppError, createError };
export type { ErrorBody, ErrorOptions };
