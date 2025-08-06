import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard from '@/shared/core/logic/guard';

export interface EventAccessUrlProps {
  value: string;
}

export default class EventAccessUrl extends ValueObject<EventAccessUrlProps> {
  private static readonly userFriendlyName = 'URL de acesso ao evento';
  private static readonly minLength = 10;

  private constructor(value: EventAccessUrlProps) {
    super(value);
  }

  get value(): string {
    return this.props.value;
  }

  get friendlyName(): string {
    return EventAccessUrl.userFriendlyName;
  }

  private static isValidUrl(url: string): boolean {
    if (!this.isValidLength(url)) {
      throw new GenericErrors.InvalidParam(
        `${this.userFriendlyName} deve ter pelo menos ${this.minLength} caracteres`,
      );
    }

    return true;
  }

  private static isValidLength(url: string): boolean {
    return url.length >= this.minLength;
  }

  private static format(url: string): string {
    return url.trim();
  }

  public static create(type: string): EventAccessUrl {
    const guardResult = Guard.againstNullOrUndefined(type, this.userFriendlyName);

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    const formattedUrl = this.format(type);

    const isValid = this.isValidUrl(formattedUrl);

    if (!isValid) {
      throw new GenericErrors.InvalidParam(`${this.userFriendlyName} inválido`);
    }

    return new EventAccessUrl({ value: formattedUrl });
  }
}
