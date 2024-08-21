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
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
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
