import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/createOffer.dto';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async createOffer(createOfferDto: CreateOfferDto): Promise<Offer> {
    const wish = await this.wishRepository.findOneBy({
      id: createOfferDto.itemId,
    });

    if (!wish) {
      throw new NotFoundException(
        `Wish with id ${createOfferDto.itemId} not found`,
      );
    }

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
