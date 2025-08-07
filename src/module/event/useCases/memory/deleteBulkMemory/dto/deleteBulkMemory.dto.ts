import { ValidatedIds } from '@/shared/decorators';

export class DeleteBulkMemoryDTO {
  @ValidatedIds('ids das memórias')
  memoryIds: string[];
}
