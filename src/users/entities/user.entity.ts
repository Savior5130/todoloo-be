import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ description: 'Unique identifier of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'The username of the user', example: 'johndoe' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The hashed password for this account' })
  @Column()
  password: string;

  @ApiProperty({
    description: 'The role of the account',
    example: 'admin | user',
  })
  @Column()
  role: string;
}
