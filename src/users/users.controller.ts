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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @ApiCreatedResponse({
    description: 'Created user object as response',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'User cannot register. Try again!' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Roles(Role.ADMIN)
  getAllUser() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllCommonUser() {
    return this.usersService.findAllCommonUser();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  getOne(@Param('username', ParseIntPipe) username: string) {
    return this.usersService.findOne(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':username')
  @Roles(Role.ADMIN)
  update(
    @Param('username', ParseIntPipe) username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(username, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username')
  @Roles(Role.ADMIN)
  remove(@Param('username', ParseIntPipe) username: string) {
    return this.usersService.remove(username);
  }
}
