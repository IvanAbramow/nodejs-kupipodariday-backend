import { Optional } from '@nestjs/common';
import { MinLength } from 'class-validator';

export class CreateOfferDto {
  @MinLength(1)
  amount: number;

  itemId: number;

  @Optional()
  hidden: boolean;
}
