import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsJSON,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @IsString()
  @IsOptional()
  template?: string;
}
