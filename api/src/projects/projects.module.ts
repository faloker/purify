import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schemas/project.schema';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { IssueSchema } from 'src/issues/schemas/issue.schema';
import { UnitSchema } from 'src/units/schemas/unit.schema';
import { ReportSchema } from 'src/reports/schemas/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: 'Issue', schema: IssueSchema }]),
    MongooseModule.forFeature([{ name: 'Unit', schema: UnitSchema }]),
    MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema }]),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
