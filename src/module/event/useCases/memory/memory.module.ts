import { Module } from '@nestjs/common';

import { CreateMemoryModule } from './createMemory/createMemory.module';
import { DeleteBulkMemoryModule } from './deleteBulkMemory/deleteBulkMemory.module';
import { DeleteMemoryModule } from './deleteMemory/deleteMemory.module';
import { DownloadMemoriesModule } from './downloadMemories/downloadMemories.module';
import { FindMemoryByIdModule } from './findMemoryById/findMemoryById.module';
import { ListMemoriesModule } from './listMemories/listMemories.module';
import { UpdateBulkMemoryModule } from './updateBulkMemory/updateBulkMemory.module';
import { UpdateMemoryModule } from './updateMemory/updateMemory.module';

@Module({
  imports: [
    CreateMemoryModule,
    DeleteMemoryModule,
    DeleteBulkMemoryModule,
    FindMemoryByIdModule,
    ListMemoriesModule,
    UpdateMemoryModule,
    DownloadMemoriesModule,
    UpdateBulkMemoryModule,
  ],
})
export class MemoryModule {}
