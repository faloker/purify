import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { JiraModule } from 'src/plugins/jira/jira.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [JiraModule, ConfigModule],
  controllers: [SystemController],
  providers: [SystemService]
})
export class SystemModule {}
