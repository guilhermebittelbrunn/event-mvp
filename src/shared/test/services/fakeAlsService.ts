import { AsyncLocalStorage } from 'async_hooks';

export class FakeAlsService extends AsyncLocalStorage<any> {
  getStore = jest.fn();
}
