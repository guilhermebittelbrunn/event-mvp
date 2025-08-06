import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { IMessageLogger } from '@/shared/core/infra/messageLogger/messageLogger.interface';

@Injectable()
export class DiscordService implements IMessageLogger {
  constructor(private readonly client: HttpService) {}

  private get baseUrl(): string {
    return 'https://discord.com/api/webhooks';
  }

  private get infoUrlPath(): string {
    return '';
  }

  private buildTemplate(message: string, identifier?: string): string {
    let baseMessage = `**[${process.env.NODE_ENV?.toUpperCase() || 'AMBIENTE NÃO IDENTIFICADO'}]**\n`;

    if (identifier) {
      baseMessage += `**Identificador**: ${identifier}\n`;
    }

    baseMessage += message;

    return baseMessage;
  }

  private async request(url: string, message: string) {
    await lastValueFrom(this.client.post(this.baseUrl + url, { content: message }));
  }

  public async info(message: string, identifier?: string): Promise<void> {
    await this.request(this.infoUrlPath, this.buildTemplate(message, identifier));
  }
}
