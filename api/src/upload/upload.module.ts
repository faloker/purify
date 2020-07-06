import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [ReportsModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
