import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { slugify } from '../db/plugins';
import { UnitSchema } from './schemas/unit.schema';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { IssueSchema } from 'src/issues/schemas/issue.schema';
import { ReportSchema } from 'src/reports/schemas/report.schema';
import { ProjectSchema } from 'src/projects/schemas/project.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Unit',
        useFactory: () => {
          const schema = UnitSchema;
          schema.plugin(slugify);
          return schema;
        },
      },
    ]),
    MongooseModule.forFeature([{ name: 'Issue', schema: IssueSchema }]),
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema }]),
  ],
  providers: [UnitsService],
  controllers: [UnitsController],
})
export class UnitsModule {}
