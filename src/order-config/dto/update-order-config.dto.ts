import { PartialType } from '@nestjs/mapped-types';

import { CreateOrderConfigDto } from './create-order-config.dto';

export class UpdateOrderConfigDto extends PartialType(CreateOrderConfigDto) {}
