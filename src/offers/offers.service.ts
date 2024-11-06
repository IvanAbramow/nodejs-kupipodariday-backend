import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/createOffer.dto';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { ServerException } from '../exceptions/server.exception';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
    private dataSource: DataSource,
  ) {}

  async createOffer(
    user: User,
    createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.wishesService.getWishById(createOfferDto.itemId);
      if (user.id === wish.owner.id) {
        throw new ForbiddenException(
          'Запрещено создавать сбор на собственный подарок',
        );
      }

      if (wish.raised === wish.price) {
        throw new ForbiddenException('Сбор на подарок завершен');
      }

      const raisedSum = Number(
        (Number(wish.raised) + Number(createOfferDto.amount)).toFixed(2),
      );

      if (raisedSum > wish.price) {
        throw new ServerException(
          403,
          'Запрещено жертвовать на подарок больше, чем сумма подарка',
        );
      }

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
    return this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  async getOfferById(id: number) {
    const offer = await this.offerRepository.findOneBy({ id });

    if (!offer) {
      throw new ServerException(404, 'Предложение не найдено');
    }

    return offer;
  }
}
