import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './roles.decorator';
import { Role } from './entities/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CurrentUser } from './current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info')
  @UseGuards(JwtAuthGuard)
  getUserFromToken(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Get('common')
  @UseGuards(JwtAuthGuard)
  async getAllCommonUser() {
    return this.usersService.findAllCommonUser();
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  async getAllUser() {
    return this.usersService.findAll();
  }

  @Patch(':username')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(username, updateUserDto);
  }

  @Delete(':username')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  remove(@Param('username', ParseIntPipe) username: string) {
    return this.usersService.remove(username);
  }
}
