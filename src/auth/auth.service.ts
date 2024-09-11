import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Profile } from 'passport-google-oauth20';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Role } from 'src/users/entities/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    return await this.usersService.create(createUserDto);
  }

  async validateUserToken(access_token: string): Promise<any> {
    return null;
  }

  async login(user: any) {
    const payload = { name: user.name, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
