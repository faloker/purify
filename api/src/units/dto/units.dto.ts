import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @MinLength(3)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly project: string;
}

export class Unit extends CreateUnitDto {
  readonly _id: string;
  readonly slug: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export class UnitList extends Unit {
  readonly reports: number;
  readonly tickets: number;
  readonly closed_tickets: number;
}
