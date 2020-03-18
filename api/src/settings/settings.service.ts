import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JiraSettings } from 'src/jira/interfaces/jira.interface';
import { SaveJiraSettingsBodyDto } from './dto/jira.dto';
import { JiraService } from 'src/jira/jira.service';
import { SaveSMTPSettingsBodyDto } from './dto/smtp.dto';
import { SmtpService } from 'src/smtp/smtp.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel('JiraSettings')
    private readonly jiraSettingsModel: Model<JiraSettings>,
    private jiraService: JiraService,
    private smtpService: SmtpService,
  ) {}

  async saveJiraSettings(settings: SaveJiraSettingsBodyDto) {
    try {
      const conf = await this.jiraService.saveSettings(
        settings.host,
        settings.username,
        settings.api_key,
      );
      return { id: conf._id };
    } catch (err) {
      throw new BadRequestException(
        'Unable to connect to the Jira instance. Check the provided parameters.',
      );
    }
  }

  async saveSmtpSettings(body: SaveSMTPSettingsBodyDto) {
    try {
      const conf = await this.smtpService.saveSettings(body.config);
      return { id: conf._id };
    } catch (err) {
      throw new BadRequestException(
        'Unable to connect to the SMTP server. Check the provided parameters.',
      );
    }
  }
}
