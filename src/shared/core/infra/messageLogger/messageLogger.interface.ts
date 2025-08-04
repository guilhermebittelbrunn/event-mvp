export interface IMessageLogger {
  info(message: string, identifier?: string): Promise<void>;
}

export const IMessageLoggerSymbol = Symbol('IMessageLogger');
