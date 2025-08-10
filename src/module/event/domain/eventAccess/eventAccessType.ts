import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard, { IGuardResult } from '@/shared/core/logic/guard';
import { EventAccessTypeEnum } from '@/shared/types/event/event';

export interface EventAccessTypeProps {
  value: EventAccessTypeEnum;
}

export default class EventAccessType extends ValueObject<EventAccessTypeProps> {
  private static userFriendlyName = 'tipo de acesso ao evento';

  private static userFriendlyTypeName = {
    [EventAccessTypeEnum.GUEST]: 'Convidado',
    [EventAccessTypeEnum.OWNER]: 'Proprietário',
  };

  private constructor(value: EventAccessTypeProps) {
    super(value);
  }

  get value(): EventAccessTypeEnum {
    return this.props.value;
  }

  get friendlyName(): string {
    return EventAccessType.userFriendlyName[this.value];
  }

  private static isValid(type: string): IGuardResult {
    const validOptions = Object.values(EventAccessTypeEnum);
    return Guard.isOneOf(type, validOptions, this.userFriendlyName);
  }

  public static getFriendlyTypeName(value: EventAccessTypeEnum): string {
    return this.userFriendlyTypeName[value];
  }

  public static create(type: EventAccessTypeEnum): EventAccessType {
    const guardResult = Guard.againstNullOrUndefined(type, this.userFriendlyName);

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    const isValid = this.isValid(type);

    if (!isValid.succeeded) {
      throw new GenericErrors.InvalidParam(isValid.message);
    }

    return new EventAccessType({ value: type });
  }
}
