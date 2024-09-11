import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './entities/role.enum';
import { ReadUserDto } from './dto/read-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const userExists = await this.userExists(username);

    if (userExists) {
      throw new BadRequestException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    createUserDto.password = hashedPassword;

    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findById(id: string): Promise<ReadUserDto | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user !== null) {
      const { password, ...userInfo } = user;
      return userInfo;
    }
    return undefined;
  }

  async findAll(): Promise<ReadUserDto[] | undefined> {
    const users = await this.usersRepository.find();
    if (users.length > 0) {
      const usersInfo = users.map(({ password, ...userInfo }) => userInfo);
      return usersInfo;
    }
    return undefined;
  }

  async findAllCommonUser(): Promise<ReadUserDto[] | undefined> {
    const users = await this.usersRepository.findBy({ role: Role.USER });
    if (users.length > 0) {
      const usersInfo = users.map(({ password, ...userInfo }) => userInfo);
      return usersInfo;
    }
    return undefined;
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async userExists(username: string): Promise<Boolean> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (user) return true;
    return false;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(username);
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async remove(username: string) {
    const user = await this.findOne(username);
    return this.usersRepository.remove(user);
  }
}
