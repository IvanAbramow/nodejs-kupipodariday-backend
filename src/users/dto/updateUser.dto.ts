import { IsEmail, IsOptional, IsUrl, Length, MinLength } from 'class-validator';

export class UpdateUserDto {
  @Length(1, 64)
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @MinLength(2)
  @IsOptional()
  password: string;

  @IsOptional()
  @Length(0, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}
