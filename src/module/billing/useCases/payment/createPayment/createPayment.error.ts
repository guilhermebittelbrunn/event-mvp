import EventSlug from '@/module/event/domain/event/eventSlug';
import GenericErrors from '@/shared/core/logic/genericErrors';

export namespace CreatePaymentErrors {
  export class SlugAlreadyInUse extends GenericErrors.InvalidParam {
    constructor(slug: EventSlug) {
      super(`Link de acesso do evento já em uso: ${slug.value}`);
    }
  }

  export class InvalidEventDaysRange extends GenericErrors.InvalidParam {
    constructor(daysRange: number) {
      super(`O evento deve ter no máximo ${daysRange} dias de duração`);
    }
  }
}

export default CreatePaymentErrors;
