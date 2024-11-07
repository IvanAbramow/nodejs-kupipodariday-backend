import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/createWish.dto';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UpdateWishDto } from './dto/updateWish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  createWish(@AuthUser() user: User, @Body() wishDto: CreateWishDto) {
    return this.wishesService.createWish(user, wishDto);
  }

  @Post('/:id/copy')
  @UseGuards(JwtGuard)
  copyWish(@AuthUser() user: User, @Param('id') id: number) {
    return this.wishesService.copyWishById(user, id);
  }

  @Get('/last')
  getLastWish(@AuthUser() user: User) {
    return this.wishesService.getLastWish(user.id);
  }

  @Get('/top')
  getTopWish(@AuthUser() user: User) {
    return this.wishesService.getTopWish(user.id);
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  getWishById(@AuthUser() user: User, @Param('id') id: number) {
    return this.wishesService.getWishById(user.id, id);
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  async updateWishById(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWishById({
      userId: user.id,
      id,
      updateWishDto,
    });
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteWishById(@AuthUser() user: User, @Param('id') id: number) {
    return this.wishesService.deleteWishById(user.id, id);
  }
}
