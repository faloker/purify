import { IsNotEmpty, IsString } from 'class-validator';

export class SaveJiraSettingsBodyDto {
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
