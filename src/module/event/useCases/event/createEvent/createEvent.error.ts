import EventSlug from '@/module/event/domain/event/eventSlug';
import GenericErrors from '@/shared/core/logic/genericErrors';

export namespace CreateEventErrors {
  export class SlugAlreadyInUse extends GenericErrors.InvalidParam {
    constructor(slug: EventSlug) {
      super(`Link de acesso do evento já em uso: ${slug.value}`);
    }
  }
}

export default CreateEventErrors;
