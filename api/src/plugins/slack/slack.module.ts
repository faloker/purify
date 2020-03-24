import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SlackSettingsSchema } from './schemas/slack.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'SlackSettings', schema: SlackSettingsSchema }]),
  ],
  providers: [SlackService],
  exports: [SlackService]
})
export class SlackModule {}
