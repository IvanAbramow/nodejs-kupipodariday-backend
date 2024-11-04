import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Wish, User]), HashModule],
  controllers: [OffersController],
  providers: [OffersService, WishesService, UsersService],
  exports: [OffersService],
})
export class OffersModule {}
