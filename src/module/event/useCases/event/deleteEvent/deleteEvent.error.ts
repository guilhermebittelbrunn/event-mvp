import GenericErrors from '@/shared/core/logic/genericErrors';

export namespace DeleteEventErrors {
  export class NotFoundError extends GenericErrors.NotFound {
    constructor() {
      super(`Evento não encontrado`);
    }
  }

  export class EventInProgressError extends GenericErrors.InvalidParam {
    constructor() {
      super(`Evento em andamento não pode ser deletado`);
    }
  }
}

export default DeleteEventErrors;
