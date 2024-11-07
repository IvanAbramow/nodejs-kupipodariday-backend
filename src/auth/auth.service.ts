import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { HashService } from '../hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { CustomException } from '../exceptions/custom.exception';
import { ERROR_MESSAGES } from '../config/errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);

    if (
      user &&
      (await this.hashService.comparePassword(password, user.password))
    ) {
      return user;
    }

    return null;
  }

  async auth(username: string, password: string): Promise<any> {
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new CustomException(ERROR_MESSAGES.INCORRECT_CREDENTIALS);
    }

    const payload = { username: user.username, sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
