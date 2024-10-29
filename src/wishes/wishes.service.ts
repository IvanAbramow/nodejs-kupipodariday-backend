import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DeleteResult, Repository } from 'typeorm';
import { WishDto } from './dto/wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>,
  ) {}

  async createWish(wishDto: WishDto): Promise<Wish> {
    return this.wishesRepository.save(wishDto);
  }

  async copyWishById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOneBy({ id });

    delete wish.id;

    return this.wishesRepository.save({ ...wish });
  }

  async getLastWish() {
    return this.wishesRepository.findOne({
      order: { id: 'DESC' },
    });
  }

  async getTopWish() {
    return this.wishesRepository.findOne({
      order: { raised: 'DESC' },
    });
  }

  async getWishById(id: number): Promise<Wish> {
    return this.wishesRepository.findOneBy({ id });
  }

  async deleteWishById(id: number): Promise<DeleteResult> {
    return this.wishesRepository.delete(id);
  }

  async updateWishById(id: number, wishDto: WishDto): Promise<Wish> {
    await this.wishesRepository.update(id, wishDto);

    return this.wishesRepository.findOneBy({ id });
  }
}
