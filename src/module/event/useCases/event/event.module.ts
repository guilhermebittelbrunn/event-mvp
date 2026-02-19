import { Module } from '@nestjs/common';

import { CreateEventModule } from './createEvent/createEvent.module';
import { DeleteEventModule } from './deleteEvent/deleteEvent.module';
import { FindEventByIdModule } from './findEventById/findEventById.module';
import { FindEventByIdForGuestModule } from './findEventByIdForGuest/findEventByIdForGuest.module';
import { FindEventBySlugModule } from './findEventBySlug/findEventBySlug.module';
import { ListEventsModule } from './listEvents/listEvents.module';
import { UpdateEventModule } from './updateEvent/updateEvent.module';

@Module({
  imports: [
    DeleteEventModule,
    CreateEventModule,
    UpdateEventModule,
    FindEventByIdModule,
    ListEventsModule,
    FindEventByIdForGuestModule,
    FindEventBySlugModule,
  ],
})
export class EventModule {}
