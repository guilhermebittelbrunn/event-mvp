import { ValidatedIds } from '@/shared/decorators';

export class DownloadMemoriesDTO {
  @ValidatedIds('ids das memórias')
  memoryIds: string[];
}
