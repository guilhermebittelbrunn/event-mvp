export default interface ITransactionManager {
  run<T = any>(cb: () => T | Promise<T>, options?: { timeout?: number }): Promise<T>;
}
