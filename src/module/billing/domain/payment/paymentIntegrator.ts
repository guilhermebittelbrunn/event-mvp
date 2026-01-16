import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard, { IGuardResult } from '@/shared/core/logic/guard';
import { PaymentIntegratorEnum } from '@/shared/types';

export interface PaymentIntegratorProps {
  value: PaymentIntegratorEnum;
}

export default class PaymentIntegrator extends ValueObject<PaymentIntegratorProps> {
  private static userFriendlyName = 'integrador de pagamento';

  private static userFriendlyTypeName = {
    [PaymentIntegratorEnum.STRIPE]: 'Stripe',
  };

  private constructor(value: PaymentIntegratorProps) {
    super(value);
  }

  get value(): PaymentIntegratorEnum {
    return this.props.value;
  }

  private static isValid(type: string): IGuardResult {
    const validOptions = Object.values(PaymentIntegratorEnum);
    return Guard.isOneOf(type, validOptions, this.userFriendlyName);
  }

  public static getFriendlyTypeName(value: PaymentIntegratorEnum): string {
    return this.userFriendlyTypeName[value];
  }

  public static create(type: PaymentIntegratorEnum): PaymentIntegrator {
    const guardResult = Guard.againstNullOrUndefined(type, this.userFriendlyName);

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    const isValid = this.isValid(type);

    if (!isValid.succeeded) {
      throw new GenericErrors.InvalidParam(isValid.message);
    }

    return new PaymentIntegrator({ value: type });
  }
}
