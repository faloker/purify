import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateSchema } from './schemas/template.schema';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { ReportSchema } from 'src/reports/schemas/report.schema';
import { IssueSchema } from 'src/issues/schemas/issue.schema';
import { SlackModule } from 'src/plugins/slack/slack.module';
import { UnitSchema } from 'src/units/schemas/unit.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Template', schema: TemplateSchema },
      { name: 'Report', schema: ReportSchema },
      { name: 'Issue', schema: IssueSchema },
      { name: 'Unit', schema: UnitSchema },
    ]),
    CacheModule.register(),
    SlackModule,
    ConfigModule,
  ],
  providers: [TemplatesService],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
