import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.enum';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now().toString(), ...user }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return that with hashed password', async () => {
    const createUserDto = {
      name: 'Marius',
      password: 'password',
      role: Role.ADMIN,
      username: 'username',
    };
    expect(await service.create(createUserDto)).toEqual({
      id: expect.any(String),
      name: 'Marius',
      password: expect.any(String),
      role: Role.ADMIN,
      username: 'username',
    });
  });
});
