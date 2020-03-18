import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SaveJiraSettingsBodyDto } from './dto/jira.dto';
import { SaveSMTPSettingsBodyDto } from './dto/smtp.dto';
import { GenericAuthGuard } from 'src/auth/generic-auth.guard';

@Controller('settings')
@UseGuards(GenericAuthGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Post('smtp')
  saveSmtpSettings(@Body() body: SaveSMTPSettingsBodyDto) {
    return this.settingsService.saveSmtpSettings(body)
  }

  @Post('jira')
  saveJiraSettings(@Body() body: SaveJiraSettingsBodyDto) {
    return this.settingsService.saveJiraSettings(body)
  }
}
