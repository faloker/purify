import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsObject,
  IsUUID,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetIssuesQueryDto {
  @ApiProperty({
    description: 'The slug of a unit you want to get issues for.',
  })
  @IsString()
  @IsNotEmpty()
  readonly unit: string;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter by issue status.',
  })
  @IsString()
  @IsIn(['true', 'false'])
  @IsOptional()
  readonly closed?: string;

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
    type: Boolean,
    description: 'Include addtional fields, such as comments and template.',
    default: 'true',
  })
  @IsString()
  @IsIn(['true', 'false'])
  @IsOptional()
  readonly verbose?: string;
}

export class UpdateIssuesBodyDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly ids: string[];

  @ApiProperty()
  @IsObject()
  readonly change: any;
}

export class IdParamDto {
  @ApiProperty()
  @IsUUID('4')
  @IsNotEmpty()
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
