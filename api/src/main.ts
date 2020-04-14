/* eslint-disable @typescript-eslint/no-var-requires */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const configService = app.get<ConfigService>(ConfigService);

  app.register(require('fastify-file-upload'));
  app.register(require('fastify-cookie'));
  
  if (configService.get<string>('NODE_ENV') === 'local') {
    app.register(require('fastify-cors'), {
      credentials: true,
      origin: 'http://localhost:8080',
    });
  }
  
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      validationError: { target: false, value: false },
    })
    );
  app.use(helmet());

  await app.listen(
    Number(configService.get<number>('PORT')) || 3000,
    '0.0.0.0'
  );
}
bootstrap();
