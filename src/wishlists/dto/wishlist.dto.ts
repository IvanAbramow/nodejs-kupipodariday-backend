import { IsArray, IsOptional, IsString } from 'class-validator';

export class WishlistDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsArray()
  @IsOptional()
  itemsId: number[];
}
