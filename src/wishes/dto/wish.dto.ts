import { IsString, IsUrl, Length } from 'class-validator';

export class WishDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  price: number;

  @Length(1, 1024)
  description: string;
}
