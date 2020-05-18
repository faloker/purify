import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetIssuesQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly unit: string;
}

export class UpdateIssuesBodyDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly ids: string[];

  @ApiProperty()
  @IsObject()
  readonly change: any;
}

export class IdParamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}

export class CreateTicketBodyDto {
  // TODO Add actual fields here
  @ApiProperty()
  @IsNotEmpty()
  readonly fields: any;
}

export class SaveCommentBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly author: string;
}