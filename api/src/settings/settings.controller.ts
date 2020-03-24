import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import {
  JiraSettingsBodyDto,
  SMTPSettingsBodyDto,
  SlackSettingsBodyDto,
} from './dto/settings.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';

@Controller('settings')
@UseGuards(GenericAuthGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Post('smtp')
  saveSmtpSettings(@Body() body: SMTPSettingsBodyDto) {
    return this.settingsService.saveSmtpSettings(body);
  }

  @Post('jira')
  saveJiraSettings(@Body() body: JiraSettingsBodyDto) {
    return this.settingsService.saveJiraSettings(body);
  }

  @Post('slack')
  saveSlackSettings(@Body() body: SlackSettingsBodyDto) {
    return this.settingsService.saveSlackSettings(body);
  }
}
