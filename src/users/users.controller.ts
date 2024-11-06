import { Body, Controller, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { User } from './entities/user.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async getUserInfo(@AuthUser() user: User) {
    const userInfo = await this.usersService.findById(user.id);

    if (!userInfo) {
      throw new NotFoundException('Пользователь не найден');
    }

    return plainToClass(User, userInfo);
  }

  @Get('/:username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(
        `Пользователь с username ${username} не найден`,
      );
    }

    return plainToClass(User, user);
  }

  @Get('/me/wishes')
  async getMyWishes(@AuthUser() user: User) {
    return this.usersService.getUserWishes(user);
  }

  @Get('/:username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    return this.usersService.getWishesByUsername(username);
  }

  @Patch('/me')
  async updateUserInfo(
    @AuthUser() user: User,
    @Body() updateUserParams: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUserInfo(
      user.id,
      updateUserParams,
    );

    return plainToClass(User, updatedUser);
  }

  @Post('/find')
  async findByQuery(@Body('query') query: string) {
    const users = await this.usersService.findMany(query);

    return plainToInstance(User, users);
  }
}
