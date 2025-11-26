import { Module } from '@nestjs/common';

import { UpdateBulkMemoryController } from './updateBulkMemory.controller';
import { UpdateBulkMemoryService } from './updateBulkMemory.service';

import { UpdateMemoryModule } from '../updateMemory/updateMemory.module';

@Module({
  imports: [UpdateMemoryModule],
  controllers: [UpdateBulkMemoryController],
  providers: [UpdateBulkMemoryService],
})
export class UpdateBulkMemoryModule {}
