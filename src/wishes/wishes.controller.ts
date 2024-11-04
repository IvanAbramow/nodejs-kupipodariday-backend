import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post, UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishDto } from './dto/wish.dto';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  createWish(@AuthUser() user: User, @Body() wishDto: WishDto) {
    return this.wishesService.createWish(user, wishDto);
  }

  @Post('/:id/copy')
  @UseGuards(JwtGuard)
  copyWish(@AuthUser() user: User, @Param('id') id: number) {
    return this.wishesService.copyWishById(user, id);
  }

  @Get('/last')
  getLastWish() {
    return this.wishesService.getLastWish();
  }

  @Get('/top')
  getTopWish() {
    return this.wishesService.getTopWish();
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  async getWishById(@Param('id') id: number) {
    const wish = await this.wishesService.getWishById(id);

    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }

    return wish;
  }

  @Patch('/:id')
  @UseGuards(JwtGuard)
  async updateWishById(@Param('id') id: number, @Body() wishDto: WishDto) {
    const wish = await this.wishesService.getWishById(id);

    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }

    return this.wishesService.updateWishById(id, wishDto);
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  async deleteWishById(@Param('id') id: number) {
    const wish = await this.wishesService.getWishById(id);

    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }

    return this.wishesService.deleteWishById(id);
  }
}
