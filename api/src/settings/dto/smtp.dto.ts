import { IsObject } from 'class-validator';

export class SaveSMTPSettingsBodyDto {
  @IsObject()
  readonly config: any;
}
