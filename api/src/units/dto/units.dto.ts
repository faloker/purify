import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitDto {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  readonly displayName: string;
}

export class EditUnitDto extends CreateUnitDto {}

// export class UnitList extends CreateUnitDto {
//   readonly numIssues: number;
//   readonly numClosedIssues: number;
//   readonly numReports: number;
//   readonly numTickets: number;
// }
