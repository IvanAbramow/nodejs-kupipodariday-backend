import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/createOffer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async createOffer(createOfferDto: CreateOfferDto): Promise<Offer> {
    return this.offerRepository.save(createOfferDto);
  }

  async getAllOffers(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async getOfferById(id: number) {
    return this.offerRepository.findOneBy({ id });
  }
}
