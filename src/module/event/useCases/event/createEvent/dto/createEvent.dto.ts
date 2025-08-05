import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional, ValidateIf, Validate } from 'class-validator';

import { ValidatedDateString, ValidatedEnum, ValidatedString } from '@/shared/decorators';
import { EventStatusEnum } from '@/shared/types/user/event';

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
  start_at: Date;

  @ValidatedDateString('data de término')
  @ValidateIf((o) => o.start_at && o.end_at)
  @Validate(
    (value, args) => {
      const object = args.object as CreateEventDTO;
      if (object.start_at && value) {
        return new Date(value) > new Date(object.start_at);
      }
      return true;
    },
    {
      message: 'A data de término deve ser posterior à data de início',
    },
  )
  end_at: Date;

  @ApiHideProperty()
  userId: string;
}
