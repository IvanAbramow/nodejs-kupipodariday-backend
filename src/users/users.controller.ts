import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async getUserInfo(@AuthUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Get('/:username')
  async getUserByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
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
    return this.usersService.updateUserInfo(user.id, updateUserParams);
  }

  @Post('/find')
  async findByQuery(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
}
