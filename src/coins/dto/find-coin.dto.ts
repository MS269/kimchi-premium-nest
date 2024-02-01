import { IsNotEmpty, IsString, IsUppercase } from 'class-validator';

export class FindCoinDto {
  @IsString()
  @IsNotEmpty()
  exchange: string;

  @IsUppercase()
  @IsNotEmpty()
  baseAsset: string;

  @IsUppercase()
  @IsNotEmpty()
  quoteAsset: string;
}
