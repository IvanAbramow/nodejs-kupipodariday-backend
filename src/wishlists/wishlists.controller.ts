import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistDto } from './dto/wishlist.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../auth/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  @Post()
  createWishlist(@AuthUser() user: User, @Body() createWishlistDto: WishlistDto) {
    return this.wishlistService.create(user, createWishlistDto);
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
