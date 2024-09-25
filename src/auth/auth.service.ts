import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Profile } from 'passport-google-oauth20';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from 'src/users/entities/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async validateGoogleUser(profile: Profile) {
    const user = await this.usersService.findOne(profile._json.email);
    if (user) return user;

    const createUserDto: CreateUserDto = {
      name: profile.displayName,
      password: '',
      role: Role.USER,
      username: profile.emails[0].value,
    };
    return await this.create(createUserDto);
  }

  async validateRefreshToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_RT_SECRET,
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  async generateAccessToken({
    userId,
    name,
    username,
  }: {
    userId: string;
    name: string;
    username: string;
  }): Promise<string> {
    const payload = { name, username, sub: userId };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_AT_SECRET,
      expiresIn: '15m',
    });
    return token;
  }

  async generateRefreshToken({
    userId,
    name,
    username,
  }: {
    userId: string;
    name: string;
    username: string;
  }): Promise<string> {
    const payload = { name, username, sub: userId };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_RT_SECRET,
      expiresIn: '7d',
    });
    return token;
  }

  async login(user: any) {
    const access_token = await this.generateAccessToken({
      userId: user.id,
      name: user.name,
      username: user.username,
    });
    const refresh_token = await this.generateRefreshToken({
      userId: user.id,
      name: user.name,
      username: user.username,
    });
    return { access_token, refresh_token };
  }

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const userExists = await this.usersService.userExists(username);
    if (userExists) {
      throw new BadRequestException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    createUserDto.password = hashedPassword;

    const newUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return this.login(newUser);
  }

  async refreshAccessToken(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_RT_SECRET,
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new Error('User not found');
      }

      const access_token = await this.generateAccessToken({
        userId: user.id,
        name: user.name,
        username: user.username,
      });

      return access_token;
    } catch {
      throw new Error('Invalid refresh token');
    }
  }
}
