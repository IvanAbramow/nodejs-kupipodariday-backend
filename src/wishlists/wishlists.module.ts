import { Module } from '@nestjs/common';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Offer } from '../offers/entities/offer.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, User, Wish, Offer]),
    HashModule,
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService, UsersService, WishesService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
