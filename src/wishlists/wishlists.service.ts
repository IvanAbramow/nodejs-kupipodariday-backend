import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { WishlistDto } from './dto/wishlist.dto';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
    private usersService: UsersService,
  ) {}

  async create(user: User, createWishlistDto: WishlistDto): Promise<Wishlist> {
    const { itemsId, ...rest } = createWishlistDto;

    const items = await this.wishesService.getWishListByIds(itemsId);
    const owner = await this.usersService.findById(user.id);

     return this.wishlistRepository.save({
      ...rest,
      items,
      owner,
    });
  }

  async getAllLists(): Promise<Wishlist[]> {
    return this.wishlistRepository.find();
  }

  async getById(id: number) {
    return this.wishlistRepository.findOne({
      relations: ['items', 'owner'],
      where: { id },
    });
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
