import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { HashService } from '../hash/hash.service';

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

  async findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }
}
