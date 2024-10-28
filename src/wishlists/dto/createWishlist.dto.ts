import { Optional } from '@nestjs/common';

export class CreateWishlistDto {
  @Optional()
  name: string;

  @Optional()
  image: string;

  @Optional()
  itemsId: number[];
}
