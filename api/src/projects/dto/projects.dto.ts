import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  readonly title: string;

  @IsString()
  readonly subtitle: string;
}

export class EditProjectDto extends CreateProjectDto {}

export class Project extends CreateProjectDto {
  readonly _id: string;
  readonly slug: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export class ProjectList {
  readonly project: Project;
  readonly issues: number;
  readonly units: number;
  readonly tickets: number;
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
