import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ProjectDto {
  @IsString()
  @MinLength(3)
  readonly title: string;

  @IsString()
  readonly subtitle: string;
}

export class GetStatsDto {
  @IsString()
  @IsNotEmpty()
  readonly project: string;
}