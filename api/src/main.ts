/* eslint-disable @typescript-eslint/no-var-requires */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
      origin: '*',
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

  const apiSeverUrl = `${
    configService.get<string>('SECURE') === 'true' ? 'https' : 'http'
  }://${configService.get<string>('DOMAIN')}`;

  const options = new DocumentBuilder()
    .setTitle('Purify API')
    .setDescription('The Purify API description')
    .setVersion('0.2.0')
    .addServer(apiSeverUrl)
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
