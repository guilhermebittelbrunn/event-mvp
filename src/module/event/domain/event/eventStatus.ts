import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard, { IGuardResult } from '@/shared/core/logic/guard';
import { EventStatusEnum } from '@/shared/types/user/event';

export interface EventStatusProps {
  value: EventStatusEnum;
}

export default class EventStatus extends ValueObject<EventStatusProps> {
  private static userFriendlyName = 'status do evento';

  private static userFriendlyTypeName = {
    [EventStatusEnum.DRAFT]: 'Rascunho',
    [EventStatusEnum.PUBLISHED]: 'Publicado',
    [EventStatusEnum.PENDING_PAYMENT]: 'Aguardando pagamento',
    [EventStatusEnum.IN_PROGRESS]: 'Em andamento',
    [EventStatusEnum.COMPLETED]: 'Concluído',
    [EventStatusEnum.CANCELLED]: 'Cancelado',
  };

  private constructor(value: EventStatusProps) {
    super(value);
  }

  get value(): EventStatusEnum {
    return this.props.value;
  }

  get friendlyName(): string {
    return EventStatus.userFriendlyName[this.value];
  }

  private static isValid(type: string): IGuardResult {
    const validOptions = Object.values(EventStatusEnum);
    return Guard.isOneOf(type, validOptions, this.userFriendlyName);
  }

  public static getFriendlyTypeName(value: EventStatusEnum): string {
    return this.userFriendlyTypeName[value];
  }

  public static create(type: EventStatusEnum): EventStatus {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: type, argumentName: 'status do evento' },
    ]);

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    const isValid = this.isValid(type);

    if (!isValid.succeeded) {
      throw new GenericErrors.InvalidParam(isValid.message);
    }

    return new EventStatus({ value: type });
  }
}
