import { Inject, Injectable } from '@nestjs/common';
import { addDays, differenceInDays, endOfDay, startOfDay } from 'date-fns';

import CreateEventErrors from './createEvent.error';
import { CreateEventDTO } from './dto/createEvent.dto';

import {
  IPlanRepository,
  IPlanRepositorySymbol,
} from '@/module/billing/repositories/plan.repository.interface';
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
import { IUserRepository, IUserRepositorySymbol } from '@/module/user/repositories/user.repository.interface';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';
import { isEmpty } from '@/shared/core/utils/undefinedHelpers';
import { PlanTypeEnum } from '@/shared/types/billing/plan';
import { EventStatusEnum } from '@/shared/types/event/event';
import { MAX_EVENT_DAYS_RANGE } from '@/shared/utils';

@Injectable()
export class CreateEventService {
  constructor(
    @Inject(IEventRepositorySymbol) private readonly eventRepo: IEventRepository,
    @Inject(IPlanRepositorySymbol) private readonly planRepo: IPlanRepository,
    @Inject(IUserRepositorySymbol) private readonly userRepo: IUserRepository,
    private readonly addAccessToEvent: AddAccessToEvent,
    private readonly addFileService: AddFileService,
    private readonly createPaymentService: CreatePaymentService,
  ) {}

  async execute(dto: CreateEventDTO) {
    const { slug, userId } = await this.validatePayload(dto);

    const status = EventStatus.create(
      dto?.isForTesting ? EventStatusEnum.PUBLISHED : EventStatusEnum.PENDING_PAYMENT,
    );

    const event = Event.create({
      ...dto,
      startAt: startOfDay(dto.startAt),
      endAt: endOfDay(dto.endAt),
      userId: UniqueEntityID.create(userId),
      slug: EventSlug.create(slug),
      status,
    });

    event.config = EventConfig.create({ eventId: event.id });

    this.addAccessToEvent.execute({ event });

    const plan = await this.planRepo.findByType(PlanTypeEnum.EVENT_BASIC);

    if (plan) {
      if (plan.accessDays > 0) {
        event.availableUntil = endOfDay(addDays(event.endAt, plan.accessDays));
      }

      if (event.status.value === EventStatusEnum.PENDING_PAYMENT) {
        const payment = await this.createPaymentService.execute({ event, plan });

        if (!payment) {
          event.status = EventStatus.create(EventStatusEnum.PUBLISHED);
        }
        event.paymentId = payment?.id;
      }
    }

    if (!isEmpty(dto.image)) {
      const file = await this.addFileService.execute({ file: dto.image });

      event.fileId = file.id;
    }

    return this.eventRepo.save(event);
  }

  private async validatePayload(dto: CreateEventDTO) {
    const { slug, endAt, startAt, isAdmin, userId } = dto;

    if (userId) {
      const user = await this.userRepo.findById(userId);

      if (!user) {
        throw new CreateEventErrors.UserNotFound();
      }
    }

    if (!isAdmin) {
      dto.isForTesting = false;

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
