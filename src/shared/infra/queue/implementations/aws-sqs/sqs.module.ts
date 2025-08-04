import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { Module } from '@nestjs/common';

import { SqsService } from './sqs.service';

@Module({
  imports: [DiscoveryModule],
  providers: [SqsService],
  exports: [SqsService],
})
export class SqsModule {}
