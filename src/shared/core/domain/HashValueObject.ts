import * as bcrypt from 'bcrypt';

import ValueObject from './ValueObject';

interface BaseHashValueObjectProps {
  value: string;
  hashed?: boolean;
}

export default abstract class HashValueObject<T extends BaseHashValueObjectProps> extends ValueObject<T> {
  protected abstract salt: number;

  get value(): string {
    return this.props.value;
  }

  /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed value.
   */
  public async compare(plainText: string): Promise<boolean> {
    let hashed: string;

    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainText, hashed);
    }

    return this.props.value === plainText;
  }

  private async bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainText, hashed);
    } catch (error) {
      return false;
    }
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed || false;
  }

  private async hash(str: string): Promise<string> {
    return bcrypt.hash(str, this.salt);
  }

  public async getHashedValue(): Promise<string> {
    if (this.isAlreadyHashed()) {
      return this.props.value;
    }

    return this.hash(this.props.value);
  }
}
