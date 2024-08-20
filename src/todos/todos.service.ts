import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

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
      (await this.usersRepository.findOneBy({ username: assignee_username }));
    const todo = {
      ...createTodoDto,
      assignee,
      creator: user,
    };
    const newTodo = this.todosRepository.create(todo);
    return this.todosRepository.save(newTodo);
  }

  findAll(userId: string): Promise<Todo[]> {
    return this.todosRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.creator', 'creator')
      .leftJoinAndSelect('todo.assignee', 'assignee')
      .where('todo.creatorId = :userId OR todo.assigneeId = :userId', {
        userId,
      })
      .getMany();
  }

  findOne(id: number) {
    return this.todosRepository.findOneBy({ id });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const todo = await this.findOne(id);
    return this.todosRepository.save({ ...todo, ...updateTodoDto });
  }

  async remove(id: number) {
    const todo = await this.findOne(id);
    return this.todosRepository.remove(todo);
  }
}
