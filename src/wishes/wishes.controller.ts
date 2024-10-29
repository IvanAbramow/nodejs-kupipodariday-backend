import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishDto } from './dto/wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  createWish(@Body() wishDto: WishDto) {
    return this.wishesService.createWish(wishDto);
  }

  @Post('/copy')
  copyWish(@Param('id') id: number) {
    return this.wishesService.copyWishById(id);
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
  async getWishById(@Param('id') id: number) {
    const wish = await this.wishesService.getWishById(id);

    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }

    return wish;
  }

  @Patch('/:id')
  async updateWishById(@Param('id') id: number, @Body() wishDto: WishDto) {
    const wish = await this.wishesService.getWishById(id);

    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }

    return this.wishesService.updateWishById(id, wishDto);
  }

  @Delete('/:id')
  async deleteWishById(@Param('id') id: number) {
    const wish = await this.wishesService.getWishById(id);

    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }

    return this.wishesService.deleteWishById(id);
  }
}
