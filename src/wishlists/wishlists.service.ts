import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishlistDto } from './dto/wishlist.dto';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { CustomException } from '../exceptions/custom.exception';
import { ERROR_MESSAGES } from '../config/errors';

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

    const items = await this.wishesService.getWishesByIds(itemsId);
    const owner = await this.usersService.findById(user.id);

    const wishlist = await this.wishlistRepository.save({
      ...rest,
      items,
      owner,
    });

    return {
      ...wishlist,
      owner: plainToInstance(User, wishlist.owner),
    };
  }

  async getAllLists(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistRepository.find({
      relations: ['items', 'owner'],
    });

    return wishlists.map((wishlist) => ({
      ...wishlist,
      owner: plainToInstance(User, wishlist.owner),
    }));
  }

  async getById(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException(ERROR_MESSAGES.WISHLIST_ID_NOT_NUMBER);
    }

    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'owner'],
    });

    if (!wishlist) {
      throw new CustomException(ERROR_MESSAGES.WISHLIST_NOT_FOUND);
    }

    return {
      ...wishlist,
      owner: plainToInstance(User, wishlist.owner),
    };
  }

  async deleteById(userId: number, id: number) {
    const wish = await this.getById(id);

    if (userId !== wish.owner.id) {
      throw new CustomException(ERROR_MESSAGES.FORBID_TO_CHANGE_WISHLIST);
    }

    await this.wishlistRepository.delete(id);
  }

  async updateById({
    userId,
    id,
    updateWishlistDto,
  }: {
    userId: number;
    id: number;
    updateWishlistDto: WishlistDto;
  }) {
    const wishlist = await this.getById(id);

    if (userId !== wishlist.owner.id) {
      throw new CustomException(ERROR_MESSAGES.FORBID_TO_CHANGE_WISHLIST);
    }

    if (updateWishlistDto.itemsId) {
      for (const itemId of updateWishlistDto.itemsId) {
        await this.wishesService.getWishById(userId, itemId);
      }

      wishlist.items = await this.wishesService.getWishesByIds(
        updateWishlistDto.itemsId,
      );
    }

    Object.assign(wishlist, updateWishlistDto);
    await this.wishlistRepository.save(wishlist);

    return this.getById(id);
  }
}
