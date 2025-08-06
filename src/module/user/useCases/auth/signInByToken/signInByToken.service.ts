import { Inject, Injectable } from '@nestjs/common';

import { SignInByTokenDTO } from './dto/signInByToken.dto';

import { ValidateEventAccess } from '@/module/event/domain/event/services/validateEventAccess/validateEventAccess.service';
import { IEventAccessRepository } from '@/module/event/repositories/eventAccess.repository.interface';
import { IEventAccessRepositorySymbol } from '@/module/event/repositories/eventAccess.repository.interface';
import GenericErrors from '@/shared/core/logic/genericErrors';
import { IJwtService, IJwtServiceSymbol } from '@/shared/services/jwt/jwt.interface';

@Injectable()
export class SignInByTokenService {
  constructor(
    @Inject(IEventAccessRepositorySymbol) private readonly eventAccessRepo: IEventAccessRepository,
    @Inject(IJwtServiceSymbol) private readonly jwtService: IJwtService,
    private readonly validateEventAccess: ValidateEventAccess,
  ) {}

  async execute(dto: SignInByTokenDTO) {
    const eventAccess = await this.eventAccessRepo.findById(dto.token);

    if (!eventAccess) {
      throw new GenericErrors.NotAuthorized();
    }

    const event = await this.validateEventAccess.execute(eventAccess.eventId.toValue());

    if (!event) {
      throw new GenericErrors.NotAuthorized();
    }

    const token = await this.jwtService.generateEventToken({
      id: event.id?.toValue(),
      slug: event.slug?.value,
      type: eventAccess.type?.value,
      expiresAt: event.endAt?.getTime(),
    });

    return { event, token };
  }
}
