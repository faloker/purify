import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnitDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly project: string;
}

export class GetUnitsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly project: string;
}

export class DeleteUnitDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}