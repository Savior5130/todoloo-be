import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Todo } from 'src/todos/entities/todo.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Todo) private todosRepository: Repository<Todo>,
  ) {}

  async create(user: User, createCommentDto: CreateCommentDto) {
    const todo = await this.todosRepository.findOneBy({
      id: createCommentDto.todo_id,
    });
    const comment = {
      ...createCommentDto,
      todo,
      datetime: new Date().toISOString(),
      creator: user,
    };
    const newComment = this.commentsRepository.create(comment);
    return this.commentsRepository.save(newComment);
  }

  async findAllByTodoId(todoId: number): Promise<Comment[]> {
    const todo = await this.todosRepository.findOneBy({ id: todoId });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${todoId} not found`);
    }

    return this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.todoId = :todoId', { todoId })
      .getMany();
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
