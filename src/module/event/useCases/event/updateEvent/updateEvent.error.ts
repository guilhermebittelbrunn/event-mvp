import EventSlug from '@/module/event/domain/event/eventSlug';
import EventStatus from '@/module/event/domain/event/eventStatus';
import GenericErrors from '@/shared/core/logic/genericErrors';

export namespace UpdateEventErrors {
  export class NotFoundError extends GenericErrors.NotFound {
    constructor() {
      super(`Evento não encontrado`);
    }
  }

  export class InvalidParam extends GenericErrors.InvalidParam {
    constructor(status: EventStatus) {
      super(`Evento com status "${status.friendlyName}" não pode ser atualizado`);
    }
  }

  export class SlugAlreadyInUse extends GenericErrors.InvalidParam {
    constructor(slug: EventSlug) {
      super(`Link de acesso do evento já em uso: ${slug.value}`);
    }
  }
}

export default UpdateEventErrors;
