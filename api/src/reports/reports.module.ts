import { Module, forwardRef, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportSchema } from './schemas/report.schema';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { IssueSchema } from 'src/issues/schemas/issue.schema';
import { UnitSchema } from 'src/units/schemas/unit.schema';
import { TemplateSchema } from 'src/templates/schemas/template.schema';
import { TemplatesModule } from 'src/templates/templates.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { UnitsModule } from 'src/units/units.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Report', schema: ReportSchema },
      { name: 'Issue', schema: IssueSchema },
      { name: 'Unit', schema: UnitSchema },
      { name: 'Template', schema: TemplateSchema },
    ]),
    CacheModule.register(),
    TemplatesModule,
    forwardRef(() => UnitsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
