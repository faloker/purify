import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsJSON,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadReportDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly file: any;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly unit: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly template?: string;
}

export class DeleteReportDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}

export class GetReportsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly unit: string;
}

export class GetReportContentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
