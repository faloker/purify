import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';
import { BodyField } from '../interfaces/template.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SaveTemplateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly report: string;

  @ApiProperty()
  @IsString()
  readonly path_to_issues: string;

  @ApiProperty()
  @IsString()
  readonly risk_field?: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly title_fields: string[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly external_comparison_fields: string[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly internal_comparison_fields: string[];

  @ApiProperty()
  @IsArray()
  readonly merge_fields: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title_pattern: string;

  @ApiProperty()
  @IsString()
  readonly subtitle_pattern: string;

  @ApiProperty()
  @IsArray()
  readonly tags: string[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly body_fields: BodyField[];
}

export class IdParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
  readonly id: string;
}

export class EditTemplateBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly path_to_issues: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly title_fields: string[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly external_comparison_fields: string[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly internal_comparison_fields: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title_pattern: string;

  @ApiProperty()
  @IsString()
  readonly subtitle_pattern: string;

  @ApiProperty()
  @IsArray()
  readonly tags: string[];

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly body_fields: BodyField[];
}
