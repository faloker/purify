import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UnitSchema } from './schemas/unit.schema';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { IssueSchema } from 'src/issues/schemas/issue.schema';
import { ReportSchema } from 'src/reports/schemas/report.schema';
import { ProjectSchema } from 'src/projects/schemas/project.schema';
import { ProjectsModule } from 'src/projects/projects.module';
import { ReportsModule } from 'src/reports/reports.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Unit', schema: UnitSchema },
      { name: 'Issue', schema: IssueSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Report', schema: ReportSchema },
    ]),
    forwardRef(() => ProjectsModule),
    forwardRef(() => ReportsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [UnitsService],
  controllers: [UnitsController],
  exports: [UnitsService],
})
export class UnitsModule {}
