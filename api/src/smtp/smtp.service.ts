import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SMTPSettings } from './interfaces/smtp.interface';

@Injectable()
export class SmtpService {
  constructor(
    @InjectModel('SMTPSettings')
    private readonly smtpSettingsModel: Model<SMTPSettings>,
  ) {}

  async saveSettings(config: any) {
    const transport = createTransport(config);

    await transport.verify();

    const existingSettings = await this.smtpSettingsModel.findOne();
    if (existingSettings) {
      existingSettings.config = config;
      return existingSettings.save();
    } else {
      return new this.smtpSettingsModel(config).save();
    }
  }

  async getSMTPClient() {
    const settings = await this.smtpSettingsModel.findOne();
    return createTransport(settings.config);
  }

  async send(to: string[], from: string, subject: string, message: string) {
    const mail = {
      from,
      to,
      subject,
      html: message,
    };

    const transport = await this.getSMTPClient();

    transport.sendMail(mail);
  }
}
