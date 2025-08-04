interface IGenericAppError {
  message: string;
}

export default abstract class GenericAppError extends Error implements IGenericAppError {
  public message: string;

  addPrefix(text: string): void {
    this.message = `${text} ${this.message}`;
  }

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
