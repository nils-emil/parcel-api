import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ParcelCreateDto {
  @IsString()
  @IsNotEmpty()
  stockKeepingUnit: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  deliveryDate: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  town: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
