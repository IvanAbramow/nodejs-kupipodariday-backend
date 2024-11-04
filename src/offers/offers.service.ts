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

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishService: WishesService,
  ) {}

  async createOffer(
    user: User,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const id = createOfferDto.itemId;
    const wish = await this.wishService.getWishById(id);

    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} not found`);
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'You cannot create an offer for your own wish',
      );
    }

    // Update the raised value
    wish.raised += createOfferDto.amount;
    await this.wishService.updateRaised(id, wish);

    const offer = this.offerRepository.create({
      ...createOfferDto,
      item: wish,
    });

    return this.offerRepository.save(offer);
  }

  async getAllOffers(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async getOfferById(id: number) {
    return this.offerRepository.findOneBy({ id });
  }
}
