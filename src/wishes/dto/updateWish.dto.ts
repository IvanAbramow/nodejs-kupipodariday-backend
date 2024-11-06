import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishDto {
  @Length(1, 250)
  @IsString()
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  price: number;

  @Length(1, 1024)
  @IsString()
  @IsOptional()
  description: string;
}
