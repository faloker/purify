/* istanbul ignore file */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IncomingWebhook } from '@slack/webhook';
import { SlackSettings } from './interfaces/slack.interface';

@Injectable()
export class SlackService {
  constructor(
    @InjectModel('SlackSettings')
    private readonly slackSettingsModel: Model<SlackSettings>
  ) {}

  async saveSettings(webhook: string) {
    const client = new IncomingWebhook(webhook);

    await client.send({
      text: 'Ping from Purify. If you see that message, everything is fine 🎉.',
    });

    const existingSettings = await this.slackSettingsModel.findOne();
    if (existingSettings) {
      existingSettings.webhook = webhook;
      return existingSettings.save();
    } else {
      return new this.slackSettingsModel({ webhook }).save();
    }
  }

  async getSlackClient() {
    const settings = await this.slackSettingsModel.findOne();

    if (settings) {
      return new IncomingWebhook(settings.webhook);
    } else {
      return null;
    }
  }

  async sendMsg(text: string) {
    const client = await this.getSlackClient();
    if (client) {
      await client.send({ text });
    }
  }
}
