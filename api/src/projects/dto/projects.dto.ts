import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @Matches(RegExp(/^[a-z0-9_.-]+$/))
  readonly name: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  readonly displayName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(40)
  readonly description: string;
}

export class EditProjectDto extends CreateProjectDto {}

export class Project extends CreateProjectDto {
  readonly _id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class ProjectList extends Project {
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
