import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { HashService } from '../hash/hash.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async findMany(query: string) {
    const emailRegexp = /^[\w\.-]+@[\w\.-]+\.\w{2,4}$/;

    const user = emailRegexp.test(query)
      ? await this.findByEmail(query)
      : await this.findByUsername(query);

    if (!user) {
      throw new NotFoundException(`User with ${query} not found`);
    }

    return [plainToClass(User, user)];
  }
}
