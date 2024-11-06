import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { User } from '../users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ServerException } from '../exceptions/server.exception';
import { UpdateWishDto } from './dto/updateWish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
    private dataSource: DataSource,
  ) {}

  async createWish(user: User, wishDto: CreateWishDto) {
    const wish = this.wishesRepository.create({ ...wishDto, owner: user });
    await this.wishesRepository.save(wish);

    return null;
  }

  async copyWishById(user: User, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wish = await this.getWishById(id);
      const wishCopies = wish.copied;

      delete wish.id;
      delete wish.owner;
      delete wish.createdAt;
      delete wish.updatedAt;
      delete wish.raised;
      delete wish.copied;

      await this.createWish(user, wish);
      await this.wishesRepository.update(id, {
        copied: wishCopies + 1,
      });

      await queryRunner.commitTransaction();

      return null;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getLastWish() {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 40,
    });

    return wishes.map((wish) => ({
      ...wish,
      owner: plainToInstance(User, wish.owner),
    }));
  }

  async getTopWish() {
    const wishes = await this.wishesRepository.find({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 20,
    });

    return wishes.map((wish) => ({
      ...wish,
      owner: plainToInstance(User, wish.owner),
    }));
  }

  async getWishById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException(`Подарок с id ${id} не найден`);
    }

    return {
      ...wish,
      owner: plainToInstance(User, wish.owner),
    };
  }

  async deleteWishById(userId: number, id: number) {
    const wish = await this.getWishById(id);

    if (userId !== wish.owner.id) {
      throw new ServerException(
        403,
        'Вы не являетесь владельцем этого подарка',
      );
    }

    await this.wishesRepository
      .createQueryBuilder()
      .update('offer')
      .set({ item: null })
      .where('item = :id', { id })
      .execute();

    await this.wishesRepository.delete(id);
  }

  async updateWishById({
    userId,
    id,
    updateWishDto,
  }: {
    userId: number;
    id: number;
    updateWishDto: UpdateWishDto;
  }): Promise<Wish> {
    const wish = await this.getWishById(id);

    if (userId !== wish.owner.id) {
      throw new ServerException(
        403,
        'Вы не являетесь владельцем этого подарка',
      );
    }

    if (updateWishDto.price) {
      if (wish.raised > 0) {
        throw new ServerException(
          403,
          'Нельзя изменить подарок, на который начали сбор',
        );
      }
    }

    await this.wishesRepository.update(id, updateWishDto);

    return this.wishesRepository.findOneBy({ id });
  }

  async updateRaised(id: number, raised: number) {
    return this.wishesRepository.update(id, { raised });
  }

  async getWishesByIds(ids: number[]): Promise<Wish[]> {
    return this.wishesRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...ids)', { ids })
      .getMany();
  }
}
