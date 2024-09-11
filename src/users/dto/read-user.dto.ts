import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.enum';

export class ReadUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'The id of this account',
  })
  id: string;

  @ApiProperty({
    description: 'The role of the account',
  })
  role: string;
}
