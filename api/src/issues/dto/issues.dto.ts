import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsObject,
} from 'class-validator';

export class GetIssuesQueryDto {
  @IsString()
  @IsNotEmpty()
  readonly unit: string;
}

export class UpdateIssuesBodyDto {
  @IsArray()
  @ArrayNotEmpty()
  readonly ids: string[];

  @IsObject()
  readonly change: any;
}

export class IdParamDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}

export class CreateTicketBodyDto {
  // TODO Add actual fields here
  @IsNotEmpty()
  readonly fields: any;
}

export class SaveCommentBodyDto {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly author: string;
}