import { Length, MinLength } from 'class-validator';

export class SigninDto {
  @Length(1, 64)
  username: string;

  @MinLength(2)
  password: string;
};
