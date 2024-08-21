import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from './entities/role.enum';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    update: jest.fn().mockImplementation((id, dto) => ({
      id,
      ...dto,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto = {
      name: 'name',
      password: 'password',
      role: Role.ADMIN,
      username: 'username',
    };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name,
      username: dto.username,
      password: dto.password,
      role: dto.role,
    });

    expect(mockUsersService.create).toHaveBeenLastCalledWith(dto);
  });

  it('should update a user', () => {
    const dto = {
      name: 'name',
      password: 'password',
      role: Role.ADMIN,
      username: 'username',
    };
    expect(controller.update('1', dto)).toEqual({
      id: '1',
      ...dto,
    });
    expect(mockUsersService.update).toHaveBeenCalled();
  });
});
