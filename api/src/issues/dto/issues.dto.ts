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
  @ApiProperty({
    description: 'The slug of a unit you want to get issues for.',
  })
  @IsString()
  @IsNotEmpty()
  readonly unit: string;

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
}

export class UpdateIssuesBodyDto {
  @IsUUID('4', { each: true })
  readonly ids: string[];

  @ValidateNested()
  @Type(() => IssueChange)
  readonly change: IssueChange;
}

export class IdParamDto {
  @IsUUID('4')
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
