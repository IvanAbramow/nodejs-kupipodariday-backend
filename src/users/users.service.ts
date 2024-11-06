import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityPropertyNotFoundError, FindManyOptions, QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';
import { ServerException } from '../exceptions/server.exception';
import { UpdateUserDto } from './dto/updateUser.dto';
import { plainToClass, plainToInstance } from 'class-transformer';

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
        throw new ServerException(
          409,
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
    }

    throw new ServerException(
      500,
      'Произошла ошибка при создании пользователя',
    );
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(
        `Пользователь с username ${username} не найден`,
      );
    }

    return plainToClass(User, user);
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

  async getWishesByUsername(username: string) {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new NotFoundException(
        `Пользователь с username ${username} не найден`,
      );
    }

    return this.getUserWishes(user);
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    return plainToClass(User, user);
  }

  async updateUserInfo(userId: number, updateUserParams: UpdateUserDto) {
    try {
      const user = await this.findById(userId);

      if (!user) {
        throw new NotFoundException(`Пользователь с id ${userId} не найден`);
      }

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
        throw new ServerException(
          400,
          `Поле ${propertyName} должно отсутствовать`,
        );
      }
      throw new ServerException(500, 'Ошибка сервера');
    }
  }

  async findMany(query: string) {
    const emailRegexp = /^[\w\.-]+@[\w\.-]+\.\w{2,4}$/;
    const queryOptions: FindManyOptions<User> = emailRegexp.test(query)
      ? { where: { email: query } }
      : { where: { username: query } };

    const users = await this.userRepository.find(queryOptions);

    return users.map((user) => plainToClass(User, user));
  }
}
