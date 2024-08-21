import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Integrate FE and BE code',
  })
  title?: string;

  @ApiProperty({
    description: 'The description of the task',
    example:
      'Update the form and HTTP request of FE to match with the predefined API',
  })
  description?: string;
}
