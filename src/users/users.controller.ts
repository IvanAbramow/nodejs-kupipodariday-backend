import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post, Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { plainToClass } from 'class-transformer';
import { FindManyOptions } from 'typeorm';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async getUserInfo(@AuthUser() user: User) {
    const userInfo = await this.usersService.findById(user.id);

    return plainToClass(User, userInfo);
  }

  @Get('/:username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    return plainToClass(User, user);
  }

  @Get('/me/wishes')
  async getMyWishes(@AuthUser() user: User) {
    return this.usersService.getUserWishes(user);
  }

  @Get('/:username/wishes')
  async getWishesByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return this.usersService.getWishesByUsername(username);
  }

  @Patch('/me')
  async updateUserInfo(
    @AuthUser() user: User,
    @Body() updateParams: CreateUserDto,
  ) {
    const userInfo = await this.usersService.findById(user.id);

    if (!userInfo) {
      throw new NotFoundException(`User with id ${user.id} not found`);
    }

    const _user = await this.usersService.updateUserInfo(user.id, updateParams);

    return plainToClass(User, _user);
  }

  @Post('/find')
  findByQuery(@Body('query') query: string) {
    const emailRegexp = /^[\w\.-]+@[\w\.-]+\.\w{2,4}$/;
    const queryOptions: FindManyOptions<User> = emailRegexp.test(query)
      ? { where: { email: query } }
      : { where: { username: query } };

    return this.usersService.findMany(queryOptions);
  }
}
