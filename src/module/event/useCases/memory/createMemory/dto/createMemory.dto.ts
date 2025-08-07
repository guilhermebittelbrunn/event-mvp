import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

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
}
