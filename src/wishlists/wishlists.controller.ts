import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
  createWishlist(
    @AuthUser() user: User,
    @Body() createWishlistDto: WishlistDto,
  ) {
    return this.wishlistService.create(user, createWishlistDto);
  }

  @Get()
  getAllWishlists() {
    return this.wishlistService.getAllLists();
  }

  @Get('/:id')
  async getWishlistById(@Param('id') id: number) {
    return this.wishlistService.getById(id);
  }

  @Patch('/:id')
  async updateWishlistById(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Body() updateWishlistDto: WishlistDto,
  ) {
    return this.wishlistService.updateById({
      userId: user.id,
      id,
      updateWishlistDto,
    });
  }

  @Delete('/:id')
  async deleteWishlistById(@AuthUser() user: User, @Param('id') id: number) {
    return this.wishlistService.deleteById(user.id, id);
  }
}
