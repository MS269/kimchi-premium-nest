import { Module } from '@nestjs/common';

import { OrderConfigController } from './order-config.controller';
import { OrderConfigService } from './order-config.service';

@Module({
  controllers: [OrderConfigController],
  providers: [OrderConfigService],
})
export class OrderConfigModule {}
