import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/createOffer.dto';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { plainToInstance } from 'class-transformer';
import { CustomException } from '../exceptions/custom.exception';
import { ERROR_MESSAGES } from '../config/errors';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
    private dataSource: DataSource,
  ) {}

  private calculateRaisedSum(currentRaised: number, amount: number): number {
    return Number((Number(currentRaised) + Number(amount)).toFixed(2));
  }

  private validateOfferCreation({
    user,
    wish,
    amount,
  }: {
    user: User;
    wish: Wish;
    amount: number;
  }) {
    if (user.id === wish.owner.id) {
      throw new CustomException(ERROR_MESSAGES.FORBID_OFFER_CREATE);
    }

    if (wish.raised === wish.price) {
      throw new CustomException(ERROR_MESSAGES.FORBID_OFFER);
    }

    const raisedSum = this.calculateRaisedSum(wish.raised, amount);
    if (raisedSum > wish.price) {
      throw new CustomException(ERROR_MESSAGES.FORBID_OFFER_AMOUNT);
    }
  }

  async createOffer(
    user: User,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.wishesService.getWishById(
        user.id,
        createOfferDto.itemId,
      );
      this.validateOfferCreation({ user, wish, amount: createOfferDto.amount });

      const raisedSum = this.calculateRaisedSum(
        wish.raised,
        createOfferDto.amount,
      );

      await this.wishesService.updateRaised(createOfferDto.itemId, raisedSum);

      const offer = this.offerRepository.create({
        ...createOfferDto,
        user,
        item: wish,
      });

      await this.offerRepository.save(offer);

      await queryRunner.commitTransaction();

      return null;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllOffers(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: ['user', 'item'],
    });

    return offers.map((offer) => ({
      ...offer,
      user: plainToInstance(User, offer.user),
    }));
  }

  async getOfferById(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException(ERROR_MESSAGES.OFFER_ID_NOT_NUMBER);
    }

    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });

    if (!offer) {
      throw new CustomException(ERROR_MESSAGES.OFFER_NOT_FOUND);
    }

    return {
      ...offer,
      user: plainToInstance(User, offer.user),
    };
  }
}
