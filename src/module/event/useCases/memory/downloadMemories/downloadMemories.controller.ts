import { Controller, Post, UseGuards, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Readable } from 'stream';

import { DownloadMemoriesService } from './downloadMemories.service';
import { DownloadMemoriesDTO } from './dto/downloadMemories.dto';

import { ValidatedBody } from '@/shared/decorators';
import { JwtAuthGuard } from '@/shared/guards/jwtAuth.guard';

@Controller('/memory/download')
@ApiTags('memory')
@UseGuards(JwtAuthGuard)
export class DownloadMemoriesController {
  constructor(private readonly useCase: DownloadMemoriesService) {}

  @Post()
  async handle(@ValidatedBody() body: DownloadMemoriesDTO): Promise<StreamableFile> {
    const archive = await this.useCase.execute(body);

    return new StreamableFile(archive as Readable, {
      type: 'application/zip',
      disposition: 'attachment; filename="memories.zip"',
    });
  }
}
