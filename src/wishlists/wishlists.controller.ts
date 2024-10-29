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
import { WishlistsService } from './wishlists.service';
import { WishlistDto } from './dto/wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  @Post()
  createWishlist(@Body() createWishlistDto: WishlistDto) {
    return this.wishlistService.create(createWishlistDto);
  }

  @Get()
  getAllWishlists() {
    return this.wishlistService.getAllLists();
  }

  @Get('/:id')
  async getWishlistById(@Param('id') id: number) {
    const wishList = await this.wishlistService.getById(id);

    if (!wishList) {
      throw new NotFoundException('Wishlist not found');
    }

    return wishList;
  }

  @Patch('/:id')
  async updateWishlistById(
    @Param('id') id: number,
    @Body() createWishlistDto: WishlistDto,
  ) {
    const wishlist = await this.wishlistService.getById(id);

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return this.wishlistService.updateById(id, createWishlistDto);
  }

  @Delete('/:id')
  async deleteWishlistById(@Param('id') id: number) {
    const wishlist = await this.wishlistService.getById(id);

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return this.wishlistService.deleteById(id);
  }
}
