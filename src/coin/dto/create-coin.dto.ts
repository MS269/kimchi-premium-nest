import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCoinDto {
  @IsString()
  @IsNotEmpty()
  readonly exchange: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsNotEmpty()
  readonly symbol: string;

  @IsString()
  @IsNotEmpty()
  readonly baseAsset: string;

  @IsString()
  @IsNotEmpty()
  readonly quoteAsset: string;

  @IsString()
  @IsOptional()
  readonly warning?: string;
}
