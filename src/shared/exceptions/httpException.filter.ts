import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';

import GenericAppError from '@/shared/core/logic/genericAppError';
import GenericErrors from '@/shared/core/logic/genericErrors';

const isTestEnvironment = process.env.NODE_ENV === 'test';
const shouldLogError = !isTestEnvironment;

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let message: string | object = 'Erro interno do servidor';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof GenericAppError) {
      message = exception.message;
      statusCode = GenericErrors.getStatusCode(exception);
    }

    if (exception instanceof HttpException) {
      message =
        typeof exception.getResponse() === 'object'
          ? Array.isArray(exception.getResponse())
            ? exception.getResponse()
            : (exception.getResponse() as { message: string }).message
          : String(exception.getResponse());
      statusCode = exception.getStatus();
    }

    if (exception instanceof AxiosError) {
      message = exception.response?.data;
      statusCode = exception.response?.status;
    }

    if (shouldLogError) {
      console.info({
        payload: { statusCode, message },
        error: exception,
        errorMessage: String(message),
        errorStatus: statusCode,
      });
    }

    response.status(statusCode).send({ message, statusCode });
  }
}
