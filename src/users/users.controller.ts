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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './roles.decorator';
import { Role } from './entities/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getAllUser() {
    return this.usersService.findAll();
  }

  @Get()
  getAllCommonUser() {
    return this.usersService.findAllCommonUser();
  }

  @Get(':username')
  getOne(@Param('username', ParseIntPipe) username: string) {
    return this.usersService.findOne(username);
  }

  @Patch(':username')
  @Roles(Role.ADMIN)
  update(
    @Param('username', ParseIntPipe) username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(username, updateUserDto);
  }

  @Delete(':username')
  @Roles(Role.ADMIN)
  remove(@Param('username', ParseIntPipe) username: string) {
    return this.usersService.remove(username);
  }
}
