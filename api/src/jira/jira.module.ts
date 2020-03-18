import { Module } from '@nestjs/common';
import { JiraService } from './jira.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JiraSettingsSchema } from './schemas/jira.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'JiraSettings', schema: JiraSettingsSchema }]),
  ],
  providers: [JiraService],
  exports: [JiraService],
})
export class JiraModule {}
