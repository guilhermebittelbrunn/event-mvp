import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from './shared/infra/database/prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async healthCheck(): Promise<{ message: string }> {
    await this.prismaService.$queryRaw`SELECT 1`;

    const message = `Server running on ${
      process.env.NODE_ENV || 'development'
    } mode. Uptime: ${process.uptime()}`;

    this.logger.log(message);

    return { message };
  }
}
