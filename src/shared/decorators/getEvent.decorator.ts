import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetEvent = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const { event } = ctx.switchToHttp().getRequest();

  return event;
});
