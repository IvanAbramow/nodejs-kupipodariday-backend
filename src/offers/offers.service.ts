import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/createOffer.dto';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  async createOffer(
    user: User,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const wish = await this.wishesService.getWishById(createOfferDto.itemId);
    if (user.id === wish.owner.id) {
      throw new NotFoundException('OfferForbidden');
    }

    const foundedUser = await this.usersService.findById(wish.owner.id);
    const raisedSum = Number(
      (Number(wish.raised) + Number(createOfferDto.amount)).toFixed(2),
    );

    if (raisedSum > wish.price) {
      throw new NotFoundException('RAISED_FORBIDDEN');
    }

    await this.wishesService.updateRaised(createOfferDto.itemId, raisedSum);

    return this.offerRepository.save({
      ...createOfferDto,
      wish,
      foundedUser,
    });
  }

  async getAllOffers(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async getOfferById(id: number) {
    return this.offerRepository.findOneBy({ id });
  }
}
