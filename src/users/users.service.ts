import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';

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
    const hashedPassword = await this.hashService.hashPassword(
      createUserDto.password,
    );

    return this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async getUserWishes(user: User) {
    return this.wishRepository.find({
      where: { owner: { id: user.id } },
      relations: ['owner', 'offers'],
    });
  }

  async getWishesByUsername(username: string) {
    return this.wishRepository.find({
      where: { owner: { username } },
      relations: ['owner', 'offers'],
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async updateUserInfo(id: number, userInfo: CreateUserDto) {
    if (userInfo.password) {
      const hashedPassword = await this.hashService.hashPassword(
        userInfo.password,
      );

      await this.userRepository.update(id, {
        ...userInfo,
        password: hashedPassword,
      });
    } else {
      await this.userRepository.update(id, userInfo);
    }

    return this.findById(id);
  }

  async findMany(query: FindManyOptions<User>) {
    return this.userRepository.find(query);
  }
}
