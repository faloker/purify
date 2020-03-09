import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UnitDto {
  @IsString()
  @MinLength(3)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly project: string;
}

export class GetUnitsDto {
  @IsString()
  @IsNotEmpty()
  readonly project: string;
}

export class DeleteUnitDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}