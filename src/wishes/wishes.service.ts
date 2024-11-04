import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DeleteResult, Repository } from 'typeorm';
import { WishDto } from './dto/wish.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
  ) {}

  async createWish(user: User, wishDto: WishDto) {
    const wish = this.wishesRepository.create({ ...wishDto, owner: user });

    return this.wishesRepository.save(wish);
  }

  async copyWishById(user: User, id: number) {
    const wish = await this.getWishById(id);
    const copiedWish = await this.createWish(user, wish);

    return this.wishesRepository.update(id, {
      copied: copiedWish.copied + 1,
    });
  }

  async getLastWish() {
    return this.wishesRepository.find({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 40,
    });
  }

  async getTopWish() {
    return this.wishesRepository.find({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async getWishById(id: number): Promise<Wish> {
    return this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  async deleteWishById(id: number): Promise<DeleteResult> {
    return this.wishesRepository.delete(id);
  }

  async updateWishById(id: number, wishDto: WishDto): Promise<Wish> {
    await this.wishesRepository.update(id, wishDto);

    return this.wishesRepository.findOneBy({ id });
  }

  async updateRaised(id: number, raised: number) {
    return this.wishesRepository.update(id, { raised });
  }

  async getWishListByIds(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishesRepository
      .createQueryBuilder('item')
      .where('item.id IN (:...ids)', { ids })
      .getMany();

    if (!wishes) {
      throw new NotFoundException('WishesNotFound');
    }
    return wishes;
  }
}
