import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ReportsModule } from 'src/reports/reports.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { UnitsModule } from 'src/units/units.module';

@Module({
  imports: [ReportsModule, ProjectsModule, UnitsModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
