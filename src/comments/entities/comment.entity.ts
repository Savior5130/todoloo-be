import { Todo } from 'src/todos/entities/todo.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  datetime: string;

  @Column()
  message: string;

  @ManyToOne(() => Todo)
  @JoinColumn()
  todo: Todo;

  @ManyToOne(() => User)
  @JoinColumn()
  creator: User;
}
