import { EventConfigModel } from '@prisma/client';

import EventConfig from '../domain/eventConfig';
import { EventConfigDTO } from '../dto/eventConfig.dto';

import Mapper from '@/shared/core/domain/Mapper';
import UniqueEntityID from '@/shared/core/domain/UniqueEntityID';

export interface EventConfigModelWithRelations extends EventConfigModel {}

class BaseEventConfigMapper extends Mapper<EventConfig, EventConfigModelWithRelations, EventConfigDTO> {
  toDomain(eventConfig: EventConfigModelWithRelations): EventConfig {
    return EventConfig.create(
      {
        eventId: new UniqueEntityID(eventConfig.eventId),
        primaryColor: eventConfig.primaryColor,
        secondaryColor: eventConfig.secondaryColor,
        primaryContrast: eventConfig.primaryContrast,
        secondaryContrast: eventConfig.secondaryContrast,
        backgroundColor: eventConfig.backgroundColor,
        backgroundContrast: eventConfig.backgroundContrast,
        textColorPrimary: eventConfig.textColorPrimary,
        textColorSecondary: eventConfig.textColorSecondary,
        welcomeMessage: eventConfig.welcomeMessage,
      },
      new UniqueEntityID(eventConfig.id),
    );
  }

  toPersistence(eventConfig: EventConfig): EventConfigModel {
    return {
      id: eventConfig.id.toValue(),
      eventId: eventConfig.eventId.toValue(),
      primaryColor: eventConfig.primaryColor,
      secondaryColor: eventConfig.secondaryColor,
      primaryContrast: eventConfig.primaryContrast,
      secondaryContrast: eventConfig.secondaryContrast,
      backgroundColor: eventConfig.backgroundColor,
      backgroundContrast: eventConfig.backgroundContrast,
      textColorPrimary: eventConfig.textColorPrimary,
      textColorSecondary: eventConfig.textColorSecondary,
      welcomeMessage: eventConfig.welcomeMessage,
      createdAt: eventConfig.createdAt,
      updatedAt: eventConfig.updatedAt,
      deletedAt: eventConfig.deletedAt,
    };
  }

  toDTO(eventConfig: EventConfig): EventConfigDTO {
    return {
      id: eventConfig.id.toValue(),
      eventId: eventConfig.eventId.toValue(),
      primaryColor: eventConfig.primaryColor,
      secondaryColor: eventConfig.secondaryColor,
      primaryContrast: eventConfig.primaryContrast,
      secondaryContrast: eventConfig.secondaryContrast,
      backgroundColor: eventConfig.backgroundColor,
      backgroundContrast: eventConfig.backgroundContrast,
      textColorPrimary: eventConfig.textColorPrimary,
      textColorSecondary: eventConfig.textColorSecondary,
      welcomeMessage: eventConfig.welcomeMessage,
      createdAt: eventConfig.createdAt,
      updatedAt: eventConfig.updatedAt,
      deletedAt: eventConfig.deletedAt,
    };
  }
}

const EventConfigMapper = new BaseEventConfigMapper();

export default EventConfigMapper;
