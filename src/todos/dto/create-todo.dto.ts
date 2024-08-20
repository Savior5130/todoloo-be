import { MinLength } from 'class-validator';

export class CreateTodoDto {
  @MinLength(5)
  title: string;
  description: string;
  assignee_username?: string;
}
