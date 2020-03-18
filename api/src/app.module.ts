import { Module } from '@nestjs/common';
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
import { JiraModule } from './jira/jira.module';
import { SettingsModule } from './settings/settings.module';
import { SmtpModule } from './smtp/smtp.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
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
    ConfigModule.forRoot(),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
