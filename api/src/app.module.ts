import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { UnitsModule } from './units/units.module';
import { IssuesModule } from './issues/issues.module';
import { ReportsModule } from './reports/reports.module';
import { TemplatesModule } from './templates/templates.module';
import { TasksModule } from './tasks/tasks.module';
import { JiraModule } from './plugins/jira/jira.module';
import { SettingsModule } from './settings/settings.module';
import { SmtpModule } from './plugins/smtp/smtp.module';
import { SlackModule } from './plugins/slack/slack.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { SystemModule } from './system/system.module';
import { UploadModule } from './upload/upload.module';
import { EventsModule } from './events/events.module';
import Joi = require('@hapi/joi');

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('DB_NAME'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        poolSize: 10,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: '/home/node/app/static',
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('local', 'production')
          .default('local'),
        MONGODB_URI: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        DOMAIN: Joi.string().required(),
        SECURE: Joi.string()
          .valid('true', 'false')
          .default('true'),
        ALLOW_REGISTRATION: Joi.string()
          .valid('true', 'false')
          .default('true'),
        USE_LDAP: Joi.string()
          .valid('true', 'false')
          .default('false'),
        USE_SSO: Joi.string()
          .valid('true', 'false')
          .default('false'),
        SAML_IDP_CERT_ONELINE: Joi.string().default('xxx'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ProjectsModule,
    UnitsModule,
    IssuesModule,
    ReportsModule,
    TemplatesModule,
    TasksModule,
    JiraModule,
    SettingsModule,
    SmtpModule,
    SlackModule,
    SystemModule,
    UploadModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
