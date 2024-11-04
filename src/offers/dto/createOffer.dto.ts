import { Optional } from '@nestjs/common';
import { IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @MinLength(1)
  itemId: number;

  @Optional()
  hidden: boolean;
}
