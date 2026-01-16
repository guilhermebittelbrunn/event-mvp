import ValueObject from '@/shared/core/domain/ValueObject';
import GenericErrors from '@/shared/core/logic/genericErrors';
import Guard, { IGuardResult } from '@/shared/core/logic/guard';
import { PaymentStatusEnum } from '@/shared/types';

export interface PaymentStatusProps {
  value: PaymentStatusEnum;
}

export default class PaymentStatus extends ValueObject<PaymentStatusProps> {
  private static userFriendlyName = 'status de pagamento';

  private static userFriendlyTypeName = {
    [PaymentStatusEnum.PENDING]: 'Pendente',
    [PaymentStatusEnum.APPROVED]: 'Aprovado',
    [PaymentStatusEnum.REJECTED]: 'Rejeitado',
    [PaymentStatusEnum.EXPIRED]: 'Expirado',
  };

  private constructor(value: PaymentStatusProps) {
    super(value);
  }

  get value(): PaymentStatusEnum {
    return this.props.value;
  }

  private static isValid(type: string): IGuardResult {
    const validOptions = Object.values(PaymentStatusEnum);
    return Guard.isOneOf(type, validOptions, this.userFriendlyName);
  }

  public static getFriendlyTypeName(value: PaymentStatusEnum): string {
    return this.userFriendlyTypeName[value];
  }

  public static create(type: PaymentStatusEnum): PaymentStatus {
    const guardResult = Guard.againstNullOrUndefined(type, this.userFriendlyName);

    if (!guardResult.succeeded) {
      throw new GenericErrors.InvalidParam(guardResult.message);
    }

    const isValid = this.isValid(type);

    if (!isValid.succeeded) {
      throw new GenericErrors.InvalidParam(isValid.message);
    }

    return new PaymentStatus({ value: type });
  }
}
