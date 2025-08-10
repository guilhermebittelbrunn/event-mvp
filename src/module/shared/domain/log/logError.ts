import { HttpException } from '@nestjs/common';
import { AxiosError } from 'axios';

import ValueObject from '@/shared/core/domain/ValueObject';
import GenericAppError from '@/shared/core/logic/genericAppError';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard from '@/shared/core/logic/guard';

export interface LogErrorProps {
  service: string;
  method: string;
  errorMessage: string;
  errorStatus: number;
  errorStack: string;
}

export default class LogError extends ValueObject<LogErrorProps> {
  private constructor(value: LogErrorProps) {
    super(value);
  }

  get service(): string {
    return this.props.service;
  }

  get method(): string {
    return this.props.method;
  }

  get errorMessage(): string {
    return this.props.errorMessage;
  }

  get errorStatus(): number {
    return this.props.errorStatus;
  }

  get errorStack(): string {
    return this.props.errorStack;
  }

  private static getCallerInfo(error?: Error): { service: string; method: string } {
    const stack = error?.stack?.split('\n') || new Error().stack?.split('\n');

    const callerLine = stack.find((line) => line.includes('at ') && !line.includes('<anonymous>'));
    const matches = callerLine?.match(/at (\S+)\.(\S+) /);

    return {
      service: matches ? matches[1] : stack[0],
      method: matches ? matches[2] : stack[1],
    };
  }

  private static mapForAxiosError(payload: AxiosError): LogErrorProps {
    return {
      ...this.getCallerInfo(payload),
      errorMessage: `Error to send request [${payload.config?.url}]: ${
        typeof payload.response?.data === 'object' &&
        payload.response?.data !== null &&
        'message' in payload.response.data
          ? (payload.response.data as { message?: string }).message
          : payload.message
      }`,
      errorStatus: payload.response?.status ?? 0,
      errorStack: payload.stack ?? '',
    };
  }

  private static mapForError(error: Error): LogErrorProps {
    return {
      ...this.getCallerInfo(error),
      errorMessage: error.message,
      errorStatus: 500,
      errorStack: error.stack ?? '',
    };
  }

  private static mapForHttpException(error: HttpException): LogErrorProps {
    const message =
      typeof error.getResponse() === 'object'
        ? Array.isArray(error.getResponse())
          ? error.getResponse()
          : (error.getResponse() as { message: string }).message
        : String(error.getResponse());

    return {
      ...this.getCallerInfo(error),
      errorMessage: String(message),
      errorStatus: error.getStatus(),
      errorStack: error.stack ?? '',
    };
  }

  private static mapForGenericAppError(error: GenericAppError): LogErrorProps {
    return {
      ...this.getCallerInfo(error),
      errorMessage: error.message,
      errorStatus: GenericErrors.getStatusCode(error),
      errorStack: error.stack ?? '',
    };
  }

  public static create(error: Error): LogError {
    const guardResult = Guard.againstNullOrUndefined(error, 'error');

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    if (error instanceof AxiosError) {
      const props = this.mapForAxiosError(error);
      return new LogError(props);
    }

    if (error instanceof HttpException) {
      const props = this.mapForHttpException(error);
      return new LogError(props);
    }

    if (error instanceof GenericAppError) {
      const props = this.mapForGenericAppError(error);
      return new LogError(props);
    }

    const props = this.mapForError(error);
    return new LogError(props);
  }
}
