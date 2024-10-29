import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { WishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: WishlistDto): Promise<Wishlist> {
    return this.wishlistRepository.save(createWishlistDto);
  }

  async getAllLists(): Promise<Wishlist[]> {
    return this.wishlistRepository.find();
  }

  async getById(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOneBy({ id });
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.wishlistRepository.delete(id);
  }

  async updateById(
    id: number,
    createWishlistDto: WishlistDto,
  ): Promise<UpdateResult> {
    return this.wishlistRepository.update(id, createWishlistDto);
  }
}
