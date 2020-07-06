import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UnitAndTemplateSlugsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly unitSlug: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly templateSlug: string;
}

export class UnitSlugDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly unitSlug: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
