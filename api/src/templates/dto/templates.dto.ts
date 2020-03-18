import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { BodyField } from '../interfaces/template.interface';

export class SaveTemplateDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly report: string;
  
  @IsString()
  readonly path_to_issues: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly title_fields: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly compare_fields: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly merge_fields: string[];

  @IsString()
  @IsNotEmpty()
  readonly title_pattern: string;

  @IsString()
  readonly subtitle_pattern: string;

  @IsArray()
  readonly tags: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly body_fields: BodyField[];
}
