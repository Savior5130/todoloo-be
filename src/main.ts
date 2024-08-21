import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Todoloo API')
    .setDescription('API for task manager application: Todoloo')
    .setVersion('1.0')
    .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
await app.listen(process.env.PORT || 3000);
}
bootstrap();
