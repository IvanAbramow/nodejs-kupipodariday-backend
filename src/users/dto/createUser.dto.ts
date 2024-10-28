import { IsEmail, IsUrl, Length, MinLength } from 'class-validator';
import { Optional } from '@nestjs/common';

export class CreateUserDto {
  @Length(1, 64)
  username: string;

  @IsEmail()
  email: string;

  @MinLength(2)
  password: string;

  @Optional()
  @Length(0, 200)
  about: string;

  @Optional()
  @IsUrl()
  avatar: string;
}
