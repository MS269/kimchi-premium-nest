import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
} from 'class-validator';

export class CreateCoinDto {
  @IsString()
  @IsNotEmpty()
  exchange: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUppercase()
  @IsNotEmpty()
  baseAsset: string;

  @IsUppercase()
  @IsNotEmpty()
  quoteAsset: string;

  @IsBoolean()
  @IsOptional()
  warning?: boolean;

  @IsString()
  @IsOptional()
  message?: string;
}
