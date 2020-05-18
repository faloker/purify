import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  readonly title: string;

  @ApiProperty()
  @IsString()
  readonly subtitle: string;
}

export class GetStatsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly project: string;
}