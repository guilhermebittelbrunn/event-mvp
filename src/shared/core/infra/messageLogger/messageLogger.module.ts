import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { DiscordModule } from './implementations/discord/discord.module';
import { DiscordService } from './implementations/discord/discord.service';
import { IMessageLoggerSymbol } from './messageLogger.interface';

@Global()
@Module({
  imports: [HttpModule, DiscordModule],
  providers: [
    {
      provide: IMessageLoggerSymbol,
      useClass: DiscordService,
    },
  ],
  exports: [IMessageLoggerSymbol],
})
export class MessageLoggerModule {}
