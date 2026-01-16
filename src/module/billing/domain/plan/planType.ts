import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard, { IGuardResult } from '@/shared/core/logic/guard';
import { PlanTypeEnum } from '@/shared/types/billing/plan';

export interface PlanTypeProps {
  value: PlanTypeEnum;
}

export default class PlanType extends ValueObject<PlanTypeProps> {
  private static userFriendlyName = 'tipo de plano';

  private static userFriendlyTypeName = {
    [PlanTypeEnum.EVENT_BASIC]: 'Evento Básico',
  };

  private constructor(value: PlanTypeProps) {
    super(value);
  }

  get value(): PlanTypeEnum {
    return this.props.value;
  }

  private static isValid(type: string): IGuardResult {
    const validOptions = Object.values(PlanTypeEnum);
    return Guard.isOneOf(type, validOptions, this.userFriendlyName);
  }

  public static getFriendlyTypeName(value: PlanTypeEnum): string {
    return this.userFriendlyTypeName[value];
  }

  public static create(type: PlanTypeEnum): PlanType {
    const guardResult = Guard.againstNullOrUndefined(type, this.userFriendlyName);

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    const isValid = this.isValid(type);

    if (!isValid.succeeded) {
      throw new GenericErrors.InvalidParam(isValid.message);
    }

    return new PlanType({ value: type });
  }
}
