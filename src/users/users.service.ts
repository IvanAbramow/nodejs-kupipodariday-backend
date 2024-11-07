import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityPropertyNotFoundError, FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';
import { CustomException } from '../exceptions/custom.exception';
import { UpdateUserDto } from './dto/updateUser.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { ERROR_MESSAGES } from '../config/errors';
import { FindUserByQueryDto } from './dto/findUserByQuery.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await this.hashService.hashPassword(
        createUserDto.password,
      );

      return await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new CustomException(ERROR_MESSAGES.CONFLICT_CREDENTIALS);
      }
    }

    throw new CustomException(ERROR_MESSAGES.SERVER_ERROR);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new CustomException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async getUserWishes(user: User) {
    const wishes = await this.wishRepository.find({
      where: { owner: { id: user.id } },
      relations: ['owner', 'offers'],
    });

    return wishes.map((wish) => ({
      ...wish,
      owner: plainToInstance(User, wish.owner),
    }));
  }

  async getWishesByUsername(username: string): Promise<Wish[]> {
    const user = await this.findByUsername(username);

    return this.getUserWishes(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new CustomException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return plainToClass(User, user);
  }

  async updateUserInfo(
    userId: number,
    updateUserParams: UpdateUserDto,
  ): Promise<User> {
    try {
      await this.findById(userId);

      if (updateUserParams.password) {
        const hashedPassword = await this.hashService.hashPassword(
          updateUserParams.password,
        );

        await this.userRepository.update(userId, {
          ...updateUserParams,
          password: hashedPassword,
        });
      } else {
        await this.userRepository.update(userId, updateUserParams);
      }

      return this.findById(userId);
    } catch (err) {
      if (err instanceof EntityPropertyNotFoundError) {
        const propertyName = err.message.match(/Property "([^"]+)"/)[1];
        throw new BadRequestException(
          `Поле ${propertyName} должно отсутствовать`,
        );
      }
      throw new CustomException(ERROR_MESSAGES.SERVER_ERROR);
    }
  }

  async findMany(findUserByQueryDto: FindUserByQueryDto): Promise<User[]> {
    const emailRegexp = /^[\w\.-]+@[\w\.-]+\.\w{2,4}$/;
    const queryOptions: FindManyOptions<User> = emailRegexp.test(
      findUserByQueryDto.query,
    )
      ? { where: { email: findUserByQueryDto.query } }
      : { where: { username: findUserByQueryDto.query } };


    const users = await this.userRepository.find(queryOptions);

    return users.map((user) => plainToClass(User, user));
  }
}
