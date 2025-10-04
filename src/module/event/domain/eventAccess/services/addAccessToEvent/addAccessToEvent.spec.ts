import { Test, TestingModule } from '@nestjs/testing';

import { AddAccessToEventDTO } from './addAccessToEvent.dto';
import { AddAccessToEvent } from './addAccessToEvent.service';

import { fakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import { EventAccessTypeEnum } from '@/shared/types/event/event';

const makePayload = (overrides?: Partial<AddAccessToEventDTO>): AddAccessToEventDTO => {
  return {
    event: fakeEvent(),
    ...overrides,
  };
};

describe('AddAccessToEvent', () => {
  let service: AddAccessToEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddAccessToEvent],
    }).compile();

    service = module.get<AddAccessToEvent>(AddAccessToEvent);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a guest access to the event', async () => {
    const payload = makePayload({ type: EventAccessTypeEnum.GUEST });

    service.execute(payload);

    expect(payload.event.accesses.guestAccess).toBeDefined();
    expect(payload.event.accesses.guestAccess?.url.value).toBeDefined();
    expect(payload.event.accesses.items.length).toBe(1);
  });

  it('should add a owner access to the event', async () => {
    const payload = makePayload({ type: EventAccessTypeEnum.OWNER });

    service.execute(payload);

    expect(payload.event.accesses.ownerAccess).toBeDefined();
    expect(payload.event.accesses.ownerAccess?.url.value).toBeDefined();
    expect(payload.event.accesses.items.length).toBe(1);
  });

  it('should replace a guest access with a new one', async () => {
    const payload = makePayload({ type: EventAccessTypeEnum.GUEST });

    service.execute(payload); // add first access
    service.execute(payload); // add second access

    expect(payload.event.accesses.guestAccess).toBeDefined();
    expect(payload.event.accesses.guestAccess?.url.value).toBeDefined();
    expect(payload.event.accesses.items.length).toBe(1);
  });

  it('should return undefined if the event is not provided', async () => {
    const payload = makePayload({ event: null });

    const result = service.execute(payload);

    expect(result).toBeUndefined();
  });
});
