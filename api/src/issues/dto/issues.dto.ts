import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
  IsOptional,
  IsIn,
  IsObject,
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
  @IsArray()
  @ArrayNotEmpty()
  readonly ids: string[];

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
