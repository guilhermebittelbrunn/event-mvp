import { FileFieldsInterceptor, File } from '@nest-lab/fastify-multer';
import { Controller, Post, UseGuards, Inject, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { CreateEventService } from './createEvent.service';
import { CreateEventDTO } from './dto/createEvent.dto';

import { EventDTO } from '@/module/event/dto/event.dto';
import EventMapper from '@/module/event/mappers/event.mapper';
import User from '@/module/user/domain/user/user';
import ITransactionManager, {
  ITransactionManagerSymbol,
} from '@/shared/core/infra/transactionManager.interface';
import { ValidatedBody } from '@/shared/decorators';
import { GetUser } from '@/shared/decorators/getUser.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';
import { FileValidatorInterceptor } from '@/shared/interceptors/fileValidator.interceptor';
import { EventStatusEnum } from '@/shared/types/event/event';
import { UserTypeEnum } from '@/shared/types/user';

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]), FileValidatorInterceptor)
  async handle(
    @GetUser() user: User,
    @ValidatedBody() body: CreateEventDTO,
    @UploadedFiles() file: { image?: File[] },
  ): Promise<EventDTO> {
    const isAdmin = user.type.value === UserTypeEnum.ADMIN;

    const payload: CreateEventDTO = {
      ...body,
      userId: user.id.toValue(),
      image: file?.image?.[0],
      ...(!isAdmin && { status: EventStatusEnum.PENDING_PAYMENT }),
    };

    const result = await this.transactionManager.run(() => this.useCase.execute(payload));

    return EventMapper.toDTO(result);
  }
}
