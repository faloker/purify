import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JiraSettingsSchema } from 'src/jira/schemas/jira.schema';
import { JiraModule } from 'src/jira/jira.module';
import { SmtpModule } from 'src/smtp/smtp.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'JiraSettings', schema: JiraSettingsSchema }]),
    JiraModule,
    SmtpModule,
  ],
  controllers: [SettingsController],
  providers: [SettingsService]
})
export class SettingsModule {}
