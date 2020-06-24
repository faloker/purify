/* eslint-disable @typescript-eslint/no-var-requires */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cors = require('cors');
import cookieParser = require('cookie-parser')
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  if (configService.get<string>('NODE_ENV') === 'local') {
    app.use(cors());
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
  app.use(cookieParser())

  const options = new DocumentBuilder()
    .setTitle('Purify API')
    .setDescription('The Purify API description')
    .setVersion('0.2.0')
    .addBearerAuth()
    .addApiKey({
      type: 'apiKey',
      name: 'apikey',
      in: 'header',
      description: 'API Key for external calls',
    })
    .addTag('projects')
    .addTag('reports')
    .addTag('issues')
    .addTag('templates')
    .addTag('units')
    .addTag('users')
    .addTag('auth')
    .addTag('settings')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(
    Number(configService.get<number>('PORT')) || 3000,
    '0.0.0.0'
  );
}

bootstrap();
