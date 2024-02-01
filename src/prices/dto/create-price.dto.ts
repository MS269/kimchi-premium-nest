import { IsDate, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePriceDto {
  // TODO
  @IsInt()
  @Min(0)
  coinId: number;

  @IsNumber()
  @Min(0)
  bidPrice: number;

  @IsNumber()
  @Min(0)
  askPrice: number;

  @IsDate()
  @IsOptional()
  timestamp?: Date;
}
