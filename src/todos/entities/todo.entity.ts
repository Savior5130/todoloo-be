import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TodoStatus } from './todostatus.enum';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, 'creatorId')
  @JoinColumn()
  creator: User;

  @ManyToOne(() => User, 'assigneeId')
  @JoinColumn()
  assignee: User;

  @Column()
  status: TodoStatus;
}
