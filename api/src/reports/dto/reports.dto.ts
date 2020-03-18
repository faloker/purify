import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UploadReportDto {
  @IsNotEmpty()
  readonly file: any;

  @IsString()
  @IsNotEmpty()
  readonly unit: string;

  @IsString()
  @IsNotEmpty()
  readonly template?: string;
}

export class DeleteReportDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}

export class GetReportsDto {
  @IsString()
  @IsNotEmpty()
  readonly unit: string;
}

export class GetReportContentDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
