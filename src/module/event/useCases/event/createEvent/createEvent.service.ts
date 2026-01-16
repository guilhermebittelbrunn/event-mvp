import { Inject, Injectable } from '@nestjs/common';
import { differenceInDays } from 'date-fns';

import CreateEventErrors from './createEvent.error';
import { CreateEventDTO } from './dto/createEvent.dto';

import { CreatePaymentService } from '@/module/billing/useCases/payment/createPayment/createPayment.service';
import Event from '@/module/event/domain/event/event';
import EventSlug from '@/module/event/domain/event/eventSlug';
import EventStatus from '@/module/event/domain/event/eventStatus';
import { AddAccessToEvent } from '@/module/event/domain/eventAccess/services/addAccessToEvent/addAccessToEvent.service';
import EventConfig from '@/module/event/domain/eventConfig';
import {
  IEventRepository,
  IEventRepositorySymbol,
} from '@/module/event/repositories/event.repository.interface';
import { AddFileService } from '@/module/shared/domain/file/services/addFile/addFile.service';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';
import { PlanTypeEnum } from '@/shared/types/billing/plan';
import { EventStatusEnum } from '@/shared/types/event/event';
import { MAX_EVENT_DAYS_RANGE } from '@/shared/utils';

@Injectable()
export class CreateEventService {
  constructor(
    @Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository,
    private readonly addAccessToEvent: AddAccessToEvent,
    private readonly addFileService: AddFileService,
    private readonly createPaymentService: CreatePaymentService,
  ) {}

  async execute(dto: CreateEventDTO) {
    const { slug, userId, isAdmin } = await this.validatePayload(dto);

    const status = EventStatus.create(isAdmin ? EventStatusEnum.PUBLISHED : EventStatusEnum.PENDING_PAYMENT);

    const event = Event.create({
      ...dto,
      userId: UniqueEntityID.create(userId),
      slug: EventSlug.create(slug),
      status,
    });

    event.config = EventConfig.create({ eventId: event.id });

    this.addAccessToEvent.execute({ event });

    if (!isEmpty(dto.image)) {
      const file = await this.addFileService.execute({ file: dto.image });

      event.fileId = file.id;
    }

    if (!isAdmin) {
      const payment = await this.createPaymentService.execute({ planType: PlanTypeEnum.EVENT_BASIC });

      if (!payment) {
        event.status = EventStatus.create(EventStatusEnum.PUBLISHED);
      }
    }

    return this.eventRepo.save(event);
  }

  private async validatePayload(dto: CreateEventDTO) {
    const { slug, endAt, startAt, isAdmin } = dto;

    if (!isAdmin) {
      const daysRange = differenceInDays(new Date(endAt), new Date(startAt));

      if (daysRange > MAX_EVENT_DAYS_RANGE) {
        throw new CreateEventErrors.InvalidEventDaysRange(MAX_EVENT_DAYS_RANGE);
      }
    }

    const eventSlug = EventSlug.create(slug);

    const existingEvent = await this.eventRepo.findBySlug(eventSlug);

    if (existingEvent) {
      throw new CreateEventErrors.SlugAlreadyInUse(eventSlug);
    }

    return dto;
  }
}
