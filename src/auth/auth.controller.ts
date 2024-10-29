import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return plainToClass(User, user);
  }

  @Post('/signin')
  async signIn(@Body() signinDto: SigninDto) {
    const { username, password } = signinDto;
    const token = await this.authService.auth(username, password);

    if (!token) {
      return { message: 'Invalid credentials' };
    }

    return token;
  }
}
