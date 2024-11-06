import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  @IsString()
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @Length(1, 1024)
  @IsString()
  description: string;
}
