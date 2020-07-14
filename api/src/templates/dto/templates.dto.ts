import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly report: string;

  @IsString()
  readonly path_to_issues: string;

  @IsString()
  readonly risk_field?: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly title_fields: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly external_comparison_fields: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly internal_comparison_fields: string[];

  @IsArray()
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

export class EditTemplateBodyDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  readonly path_to_issues: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly title_fields: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly external_comparison_fields: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly internal_comparison_fields: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly merge_fields: string[];

  @IsString()
  @IsOptional()
  readonly risk_field: string;

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

export class Template extends CreateTemplateDto {
  readonly _id: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export class TemplateList {
  readonly template: Template;
  readonly issues: number;
  readonly reports: number;
}

class BodyField {
  readonly key: string;
  readonly type: string;
}
