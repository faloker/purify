import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @Matches(RegExp(/^[a-z0-9_-]+$/))
  @MinLength(3)
  @MaxLength(40)
  readonly name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(40)
  readonly displayName: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}

export class GetProjectsQueryDto {
  @IsOptional()
  @IsIn(['true', 'false'])
  verbose?: string;
}

export class GetMetricsQueryDto {
  @IsOptional()
  @IsIn(['7', '30', '90', '365'])
  days: string;
}

export class EditProjectDto extends CreateProjectDto {}

export class AddUserDto {
  @IsString()
  userId: string;
}

export class ProjectDto extends CreateProjectDto {
  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class ProjectList extends ProjectDto {
  readonly numIssues: number;
  readonly numUnits: number;
  readonly numTickets: number;
}

class Statistics {
  readonly open: number[];
  readonly closed: number[];
  readonly risks: number[];
  readonly reports: number[];
}

class UnitStatistics {
  readonly name: string;
  readonly data: Statistics;
}

export class ProjectStatistics {
  readonly project: Statistics;
  readonly units: UnitStatistics[];
}
