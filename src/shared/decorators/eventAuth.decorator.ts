import { applyDecorators, UseGuards } from '@nestjs/common';

import { EventAuthGuard } from '../guards/eventAuth/eventAuth.guard';

/**
 * Decorator que aplica o EventAuthGuard automaticamente
 * Não requer importações adicionais nos módulos
 */
export function EventAuth() {
  return applyDecorators(UseGuards(EventAuthGuard));
}
