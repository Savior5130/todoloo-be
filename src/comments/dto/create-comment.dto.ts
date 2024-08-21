import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The author of the comment',
    example: 'John Doe',
  })
  creator_id: string;

  @ApiProperty({
    description: 'The message of the comment',
    example: 'This is looking good!',
  })
  message: string;

  @ApiProperty({
    description: 'The id of todo associated with this comment',
    example: 1,
  })
  todo_id: number;
}
