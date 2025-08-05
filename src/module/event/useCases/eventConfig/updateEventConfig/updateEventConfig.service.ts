import { Inject, Injectable } from '@nestjs/common';

import { UpdateEventConfigDTO } from './dto/updateEventConfig.dto';

import EventConfig from '@/module/event/domain/eventConfig';
import {
  IEventConfigRepository,
  IEventConfigRepositorySymbol,
} from '@/module/event/repositories/eventConfig.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { coalesce } from '@/shared/core/utils/undefinedHelpers';

@Injectable()
export class UpdateEventConfigService {
  constructor(@Inject(IEventConfigRepositorySymbol) private readonly eventConfigRepo: IEventConfigRepository) {}

  async execute(dto: UpdateEventConfigDTO) {
    const { id, eventId } = dto;

    const currentEventConfig = await this.eventConfigRepo.findById(id);

    if (!currentEventConfig || currentEventConfig.eventId?.toValue() !== eventId) {
      throw new GenericErrors.NotFound('Configuração do evento não encontrada');
    }

    const eventConfig = EventConfig.create(
      {
        eventId: currentEventConfig.eventId,
        primaryColor: coalesce(dto.primaryColor, currentEventConfig.primaryColor),
        secondaryColor: coalesce(dto.secondaryColor, currentEventConfig.secondaryColor),

        primaryContrast: coalesce(dto.primaryContrast, currentEventConfig.primaryContrast),
        secondaryContrast: coalesce(dto.secondaryContrast, currentEventConfig.secondaryContrast),

        backgroundColor: coalesce(dto.backgroundColor, currentEventConfig.backgroundColor),
        backgroundContrast: coalesce(dto.backgroundContrast, currentEventConfig.backgroundContrast),

        textColorPrimary: coalesce(dto.textColorPrimary, currentEventConfig.textColorPrimary),
        textColorSecondary: coalesce(dto.textColorSecondary, currentEventConfig.textColorSecondary),

        welcomeMessage: coalesce(dto.welcomeMessage, currentEventConfig.welcomeMessage),
      },
      currentEventConfig.id,
    );

    return this.eventConfigRepo.update(eventConfig);
  }
}
