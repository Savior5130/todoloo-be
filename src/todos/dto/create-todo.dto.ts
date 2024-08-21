import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Integrate FE and BE code',
  })
  @MinLength(5)
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    example:
      'Update the form and HTTP request of FE to match with the predefined API',
  })
  description: string;

  @ApiProperty({
    description: 'The user whom the task has been assigned to',
    example: 'johndoe',
  })
  assignee_username?: string;
}
