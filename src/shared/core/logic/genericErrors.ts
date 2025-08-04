/* eslint-disable @typescript-eslint/no-namespace */

import { HttpStatus } from '@nestjs/common';

import GenericAppError from './genericAppError';

namespace GenericErrors {
  export function getStatusCode(error: GenericAppError): HttpStatus {
    if (error instanceof GenericErrors.NotFound) {
      return HttpStatus.NOT_FOUND;
    }
    if (error instanceof GenericErrors.NotCreated) {
      return HttpStatus.FORBIDDEN;
    }
    if (error instanceof GenericErrors.NotAuthorized) {
      return HttpStatus.UNAUTHORIZED;
    }
    if (error instanceof GenericErrors.Unexpected) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    if (error instanceof GenericErrors.InvalidParam) {
      return HttpStatus.BAD_REQUEST;
    }
    if (error instanceof GenericErrors.Conflict) {
      return HttpStatus.CONFLICT;
    }
    if (error instanceof GenericErrors.BadGateway) {
      return HttpStatus.BAD_GATEWAY;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  export class NotFound extends GenericAppError {
    constructor(message?: string) {
      super(message || 'Não foi possível encontrar a entidade no momento.');
    }
  }

  export class NotCreated extends GenericAppError {
    constructor(message?: string) {
      super(message || 'Não foi possível criar a instância da entidade no momento.');
    }
  }

  export class NotAuthorized extends GenericAppError {
    constructor(message?: string) {
      super(message || 'Sem permissão para executar essa ação.');
    }
  }

  export class Unexpected extends GenericAppError {
    constructor(message?: string) {
      super(message || 'Não foi possível realizar a requisição');
    }
  }

  export class InvalidParam extends GenericAppError {
    constructor(message?: string) {
      super(message || 'Verifique os campos da requisição');
    }
  }

  export class Conflict extends GenericAppError {
    constructor(message?: string) {
      super(message || 'Entidade já cadastrada');
    }
  }

  export class BadGateway extends GenericAppError {
    constructor(message?: string) {
      super(message || 'Não foi possível processar essa ação');
    }
  }
}

export default GenericErrors;
