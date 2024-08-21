import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.enum';

export class CreateUserDto {
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
    description: 'The password for this account',
  })
  password: string;

  @ApiProperty({
    description: 'The role of the account',
    enum: ['admin', 'user'],
  })
  role: Role;
}
