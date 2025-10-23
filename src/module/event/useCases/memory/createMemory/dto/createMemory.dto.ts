import { File } from '@nest-lab/fastify-multer';
import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import Event from '@/module/event/domain/event/event';
import { ValidatedString } from '@/shared/decorators';

export class CreateMemoryDTO {
  @IsOptional()
  @ValidatedString('identificador')
  identifier?: string;

  @IsOptional()
  @ValidatedString('descrição')
  description?: string;

  @IsOptional()
  @ValidatedString('mensagem')
  message?: string;

  @ApiHideProperty()
  ipAddress: string;

  @ApiHideProperty()
  eventId: string;

  @ApiHideProperty()
  event?: Event;

  @ApiHideProperty()
  image: File;
}
