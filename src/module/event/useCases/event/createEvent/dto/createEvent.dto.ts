import { File } from '@nest-lab/fastify-multer';
import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, ValidateIf, Validate } from 'class-validator';

import { ValidatedDateString, ValidatedEnum, ValidatedString } from '@/shared/decorators';
import { EventStatusEnum } from '@/shared/types/event/event';

export class CreateEventDTO {
  @ValidatedString('nome')
  name: string;

  @ValidatedString('link de acesso')
  slug: string;

  @IsOptional()
  @ValidatedEnum('status', EventStatusEnum)
  status?: EventStatusEnum;

  @IsOptional()
  @ValidatedString('descrição')
  description?: string;

  @ValidatedDateString('data de início')
  startAt: Date;

  @ValidatedDateString('data de término')
  @ValidateIf((o) => o.startAt && o.endAt)
  @Validate(
    (value, args) => {
      const object = args.object as CreateEventDTO;
      if (object.startAt && value) {
        return new Date(value) > new Date(object.startAt);
      }
      return true;
    },
    {
      message: 'A data de término deve ser posterior à data de início',
    },
  )
  endAt: Date;

  @ApiHideProperty()
  userId: string;

  @ApiHideProperty()
  image?: File;
}
