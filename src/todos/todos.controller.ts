import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/users/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Todos')
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createTodoDto: CreateTodoDto,
    @CurrentUser() user: User,
  ) {
    return this.todosService.create(createTodoDto, user);
  }

  @Get(':user_id')
  getAll(@CurrentUser() user: any) {
    return this.todosService.findAll(user.id);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.todosService.findOne(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(+id);
  }
}
