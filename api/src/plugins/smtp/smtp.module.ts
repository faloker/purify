import { Module } from '@nestjs/common';
import { SmtpService } from './smtp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SMTPSettingsSchema } from './schemas/smtp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SMTPSettings', schema: SMTPSettingsSchema },
    ]),
  ],
  providers: [SmtpService],
  exports: [SmtpService],
})
export class SmtpModule {}
