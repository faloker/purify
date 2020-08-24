import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  readonly displayName: string;
}

export class Unit extends CreateUnitDto {
  readonly _id: string;
  readonly name: string;
  readonly displayName: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class UnitList extends Unit {
  readonly numIssues: number;
  readonly numClosedIssues: number;
  readonly numReports: number;
  readonly numTickets: number;
}

export class EditUnitDto {
  @IsString()
  @MinLength(3)
  readonly name: string;
}
