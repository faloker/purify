/* eslint-disable @typescript-eslint/no-var-requires */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cors = require('cors');
import cookieParser = require('cookie-parser');
import * as helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
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
      forbidUnknownValues: true,
    })
  );

  app.set('trust proxy', true);
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

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
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(
    Number(configService.get<number>('PORT')) || 3000,
    '0.0.0.0'
  );
}

bootstrap();
