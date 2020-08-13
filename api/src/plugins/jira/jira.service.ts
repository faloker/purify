/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, BadRequestException } from '@nestjs/common';
import * as JiraClient from 'jira-connector';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JiraSettings } from './interfaces/jira.interface';

@Injectable()
export class JiraService {
  constructor(
    @InjectModel('JiraSettings')
    private readonly jiraSettingsModel: Model<JiraSettings>
  ) {}

  async saveSettings(host: string, username: string, api_key: string) {
    const jira = new JiraClient({
      host,
      basic_auth: {
        base64: Buffer.from(`${username}:${api_key}`).toString('base64'),
      },
    });

    await jira.myself.getMyself();

    const existingSettings = await this.jiraSettingsModel.findOne({
      host,
      username,
    });
    if (existingSettings) {
      existingSettings.api_key = api_key;
      return existingSettings.save();
    } else {
      return new this.jiraSettingsModel({ host, username, api_key }).save();
    }
  }

  async getJiraClient() {
    const settings = await this.jiraSettingsModel.findOne();

    if (settings) {
      return new JiraClient({
        host: settings.host,
        basic_auth: {
          base64: Buffer.from(
            `${settings.username}:${settings.api_key}`
          ).toString('base64'),
        },
      });
    } else {
      return null;
    }
  }

  async getSettings() {
    const settings = await this.jiraSettingsModel.findOne();
    return settings ? settings : null;
  }

  async getIssue(issueKey: string) {
    const jira = await this.getJiraClient();
    return jira.issue.getIssue({ issueKey });
  }

  async createIssue(issue: any) {
    const jira = await this.getJiraClient();
    return jira.issue.createIssue({ fields: issue });
  }
}
