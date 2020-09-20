import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JiraSettings } from 'src/plugins/jira/interfaces/jira.interface';
import {
  JiraSettingsBodyDto,
  SMTPSettingsBodyDto,
  SlackSettingsBodyDto,
} from './dto/settings.dto';
import { JiraService } from 'src/plugins/jira/jira.service';
import { SmtpService } from 'src/plugins/smtp/smtp.service';
import { SlackService } from 'src/plugins/slack/slack.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel('JiraSettings')
    private readonly jiraSettingsModel: Model<JiraSettings>,
    private jiraService: JiraService,
    private smtpService: SmtpService,
    private slackService: SlackService
  ) {}

  async saveJiraSettings(settings: JiraSettingsBodyDto) {
    try {
      const conf = await this.jiraService.saveSettings(
        settings.host,
        settings.username,
        settings.api_key
      );
      return { id: conf._id };
    } catch (err) {
      throw new BadRequestException(
        'Unable to connect to the Jira instance. Check the provided parameters.'
      );
    }
  }

  async saveSmtpSettings(body: SMTPSettingsBodyDto) {
    try {
      const conf = await this.smtpService.saveSettings(body.config);
      return { id: conf._id };
    } catch (err) {
      throw new BadRequestException(
        'Unable to connect to the SMTP server. Check the provided parameters.'
      );
    }
  }

  async saveSlackSettings(body: SlackSettingsBodyDto) {
    const conf = await this.slackService.saveSettings(body.webhook);
    return { id: conf._id };
  }
}
