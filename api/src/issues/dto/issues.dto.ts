import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
  IsOptional,
  IsIn,
  IsObject,
  ValidateNested,
  IsJSON,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IssueChange {
  @IsJSON()
  @IsOptional()
  readonly fields?: string;

  @IsString()
  @IsIn(['open', 'closed'])
  @IsOptional()
  readonly status?: string;

  @IsString()
  @IsIn(['false positive', 'accepted risk', 'resolved', 'none'])
  @IsOptional()
  readonly resolution?: string;

  @IsOptional()
  @IsString()
  @IsIn(['low', 'info', 'medium', 'high', 'critical'])
  readonly risk?: string;
}

export class GetIssuesQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by issue status.',
    enum: ['open', 'closed'],
  })
  @IsString()
  @IsIn(['open', 'closed'])
  @IsOptional()
  readonly status?: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by ticket.',
  })
  @IsString()
  @IsIn(['true', 'false'])
  @IsOptional()
  readonly ticket?: string;

  @ApiPropertyOptional({
    description: 'Filter by risks. Provide a comma-separated list of risks.',
  })
  @IsOptional()
  @IsString()
  readonly risks?: string;

  @ApiPropertyOptional({
    description: 'Filter by project name',
  })
  @IsOptional()
  @IsString()
  readonly projectName?: string;

  @ApiPropertyOptional({
    description: 'Filter by unit name',
  })
  @IsOptional()
  @IsString()
  readonly unitName?: string;

  @ApiPropertyOptional({
    description: 'Limit number of results',
  })
  @IsOptional()
  @IsNumberString()
  readonly limit?: string;
}

export class UpdateIssuesBodyDto {
  @IsString({ each: true })
  readonly ids: string[];

  @ValidateNested()
  @Type(() => IssueChange)
  readonly change: IssueChange;
}

export class IdParamDto {
  @IsString()
  readonly id: string;
}

export class CreateTicketBodyDto {
  // TODO Add actual fields here
  @ApiProperty()
  @IsNotEmpty()
  readonly fields: any;
}

export class SaveCommentBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly author: string;
}
