import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { Role } from './users/entities/role.enum';
import { AllExceptionsFilter } from './all-exceptions.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());

  const usersService = app.get(UsersService);
  const username = 'testuser';
  const name = 'tester';
  const role = Role.ADMIN;
  const password = await bcrypt.hash('password', 10);
  const user = await usersService.findOne(username);
  if (!user) {
    await usersService.create({ username, password, role, name });
  }

  await app.listen(3000);
}
bootstrap();
