import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';

export interface EventSlugProps {
  value: string;
}

export default class EventSlug extends ValueObject<EventSlugProps> {
  private constructor(props: EventSlugProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValidSlug(slug: string | null): slug is string {
    if (!slug) {
      return false;
    }

    if (!this.isValidLength(slug)) {
      throw new GenericErrors.InvalidParam('Link de acesso do evento deve ter entre 3 e 50 caracteres');
    }

    // Verifica se contém apenas caracteres válidos para URL:
    // - Letras minúsculas e maiúsculas (a-z, A-Z)
    // - Números (0-9)
    // - Hífens (-)
    // - Underscores (_)
    // - Não pode começar ou terminar com hífen ou underscore
    const slugRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/;

    return slugRegex.test(slug);
  }

  private static isValidLength(slug: string): boolean {
    return slug.length >= 3 && slug.length <= 50;
  }

  private static format(slug: string): string {
    return slug.trim().toLowerCase().replace(/ /g, '-');
  }

  public static create(slug: string | null): EventSlug {
    const formattedSlug = this.format(slug);

    if (!this.isValidSlug(formattedSlug)) {
      throw new GenericErrors.InvalidParam('Link de acesso do evento inválido');
    }

    return new EventSlug({ value: formattedSlug });
  }
}
