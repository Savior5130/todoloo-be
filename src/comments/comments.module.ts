import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from 'src/todos/entities/todo.entity';
import { Comment } from './entities/comment.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Todo])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
