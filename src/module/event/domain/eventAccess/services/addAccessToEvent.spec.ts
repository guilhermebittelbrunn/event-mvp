import { Test, TestingModule } from '@nestjs/testing';

import { AddAccessToEvent } from './addAccessToEvent';
import { AddAccessToEventDTO } from './addAccessToEvent.dto';

import { fakeEvent } from '@/module/event/repositories/tests/entities/fakeEvent';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { EventAccessTypeEnum } from '@/shared/types/user/event';

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

    await service.execute(payload);

    expect(payload.event.accesses.guestAccess).toBeDefined();
    expect(payload.event.accesses.guestAccess?.url.value).toBeDefined();
    expect(payload.event.accesses.items.length).toBe(1);
  });

  it('should add a owner access to the event', async () => {
    const payload = makePayload({ type: EventAccessTypeEnum.OWNER });

    await service.execute(payload);

    expect(payload.event.accesses.ownerAccess).toBeDefined();
    expect(payload.event.accesses.ownerAccess?.url.value).toBeDefined();
    expect(payload.event.accesses.items.length).toBe(1);
  });

  it('should replace a guest access with a new one', async () => {
    const payload = makePayload({ type: EventAccessTypeEnum.GUEST });

    await service.execute(payload); // add first access
    await service.execute(payload); // add second access

    expect(payload.event.accesses.guestAccess).toBeDefined();
    expect(payload.event.accesses.guestAccess?.url.value).toBeDefined();
    expect(payload.event.accesses.items.length).toBe(1);
  });

  it('should throw an error if the event access type is not valid', async () => {
    const payload = makePayload({ type: 'invalid' as EventAccessTypeEnum });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);
  });

  it('should throw an error if the event is not provided', async () => {
    const payload = makePayload({ event: null });

    await expect(service.execute(payload)).rejects.toThrow(GenericErrors.InvalidParam);
  });
});
