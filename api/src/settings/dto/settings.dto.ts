import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class JiraSettingsBodyDto {
  @IsString()
  @IsNotEmpty()
  readonly host: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly api_key: string;
}

export class SMTPSettingsBodyDto {
  @IsObject()
  readonly config: any;
}

export class SlackSettingsBodyDto {
  @IsString()
  @IsNotEmpty()
  readonly webhook: string;
}
