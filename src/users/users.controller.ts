import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  getUserInfo(@AuthUser() user: User) {
    return this.usersService.findById(user.id);
  }
}
