import { Injectable } from '@nestjs/common';
import { JiraService } from 'src/plugins/jira/jira.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SystemService {
  constructor(
    private readonly jiraService: JiraService,
    private readonly configService: ConfigService
  ) {}

  async getSystemStatus() {
    const settings = await this.jiraService.getSettings();
    return {
      jira: settings ? true : false,
      registration:
        this.configService.get<string>('ALLOW_REGISTRATION') === 'true',
      saml: this.configService.get<string>('USE_SAML') === 'true',
      upstreamAuth: this.configService.get<string>('USE_TRUSTED_HEADER') === 'true',
    };
  }
}
