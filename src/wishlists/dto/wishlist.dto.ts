import { Optional } from '@nestjs/common';

export class WishlistDto {
  @Optional()
  name: string;

  @Optional()
  image: string;

  @Optional()
  itemsId: number[];
}
