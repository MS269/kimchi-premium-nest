import { Module } from '@nestjs/common';

import { DunamuService } from './dunamu.service';

@Module({
  providers: [DunamuService],
  exports: [DunamuService],
})
export class DunamuModule {}
