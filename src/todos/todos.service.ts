import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TodoStatus } from './entities/todostatus.enum';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todosRepository: Repository<Todo>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createTodoDto: CreateTodoDto, user: User) {
    const assignee_username = createTodoDto.assignee_username;
    const assignee =
      assignee_username &&
      (await this.usersRepository.findOne({
        where: { username: assignee_username },
      }));
    const todo = {
      ...createTodoDto,
      assignee,
      creator: user,
      status: TodoStatus.TODO,
    };
    const newTodo = this.todosRepository.create(todo);
    return await this.todosRepository.save(newTodo);
  }

  async findAll(userId: string): Promise<Todo[]> {
    return await this.todosRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.creator', 'creator')
      .leftJoinAndSelect('todo.assignee', 'assignee')
      .where('todo.creatorId = :userId OR todo.assigneeId = :userId', {
        userId,
      })
      .getMany();
  }

  async findOne(id: number) {
    return await this.todosRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    if (!todo) throw new NotFoundException('Todo not found');
    return this.todosRepository.save({ ...todo, ...updateTodoDto });
  }

  async remove(id: number) {
    const todo = await this.findOne(id);
    return this.todosRepository.remove(todo);
  }
}
