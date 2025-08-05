import { Controller, Post, UseGuards, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateEventService } from './createEvent.service';
import { CreateEventDTO } from './dto/createEvent.dto';

import { EventDTO } from '@/module/event/dto/event.dto';
import EventMapper from '@/module/event/mappers/event.mapper';
import User from '@/module/user/domain/user/user';
import ITransactionManager, {
  ITransactionManagerSymbol,
} from '@/shared/core/infra/TransactionManager.interface';
import { ValidatedBody } from '@/shared/decorators';
import { GetUser } from '@/shared/decorators/getUser.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/event')
@ApiTags('event')
@UseGuards(JwtAuthGuard)
export class CreateEventController {
  constructor(
    private readonly useCase: CreateEventService,
    @Inject(ITransactionManagerSymbol)
    private readonly transactionManager: ITransactionManager,
  ) {}

  @Post()
  async handle(@GetUser() user: User, @ValidatedBody() body: CreateEventDTO): Promise<EventDTO> {
    const payload = { ...body, userId: user.id.toValue() };

    const result = await this.transactionManager.run(() => this.useCase.execute(payload));

    return EventMapper.toDTO(result);
  }
}
