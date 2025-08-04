export default class Identifier<T> {
  constructor(private value: T) {
    this.value = value;
  }

  equals(id?: Identifier<T> | null): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  equalsRaw(id?: T): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    return this.value === id;
  }

  /**
   * Return raw value of identifier
   */

  toValue(): T {
    return this.value;
  }
}
