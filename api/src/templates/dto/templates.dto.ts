import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
  IsIn,
} from 'class-validator';

export class EditTemplateDto {
  @Matches(RegExp(/^[a-z0-9_-]+$/))
  @MinLength(3)
  @MaxLength(40)
  readonly name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(40)
  readonly displayName: string;

  @IsString()
  readonly pathToIssues: string;

  @IsString()
  @IsOptional()
  readonly riskField?: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly titleFields: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly externalComparisonFields: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly internalComparisonFields: string[];

  @IsArray()
  @IsOptional()
  readonly mergeFields: string[];

  @IsString()
  @IsNotEmpty()
  readonly titlePattern: string;

  @IsString()
  readonly subtitlePattern: string;

  @IsArray()
  readonly tags: string[];

  @IsArray()
  @ArrayNotEmpty()
  readonly bodyFields: BodyField[];
}

export class CreateTemplateDto extends EditTemplateDto {}

export class ApplyTemplateDto {
  @IsString()
  @IsNotEmpty()
  templateName: string;
}

export class Template extends EditTemplateDto {
  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class TemplateList {
  readonly template: Template;
  readonly numIssues: number;
  readonly numReports: number;
}

class BodyField {
  readonly key: string;
  readonly type: string;
  readonly alias?: string;
}

export class GetTemplatesQueryDto {
  @IsIn(['true', 'false'])
  @IsOptional()
  verbose?: string;
}
