import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JiraSettingsBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly host: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly api_key: string;
}

export class SMTPSettingsBodyDto {
  @ApiProperty()
  @IsObject()
  readonly config: any;
}

export class SlackSettingsBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly webhook: string;
}
