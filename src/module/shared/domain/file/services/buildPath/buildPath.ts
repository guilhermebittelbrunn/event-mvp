import { Injectable } from '@nestjs/common';

import { BuildPathDTO } from './buildPath.dto';

@Injectable()
export class BuildPathService {
  execute(dto: BuildPathDTO) {
    const { event, file, showDatePrefix = true } = dto;

    let basePath = `event`;

    if (showDatePrefix) {
      const datePath = this.buildDatePath();
      basePath += datePath;
    }

    if (event) {
      const eventFolder = `/${event.slug.value}-${event.id.head}`;
      basePath += eventFolder;
    }

    if (file.file) {
      basePath += `/${file.file.originalname}`;
    }

    return basePath;
  }

  private buildDatePath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    return `/${year}/${month}`;
  }
}
