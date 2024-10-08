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
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/users/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Todos')
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto, user);
  }

  @Get()
  async getAll(@CurrentUser() user: any) {
    return await this.todosService.findAll(user.id);
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
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }
}
