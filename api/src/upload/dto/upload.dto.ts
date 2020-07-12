import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UnitAndTemplateSlugsDto {
  @ApiProperty({ description: 'The slug for the unit' })
  @IsString()
  @IsNotEmpty()
  readonly unitSlug: string;

  @ApiProperty({ description: 'The slug for the template' })
  @IsString()
  @IsNotEmpty()
  readonly templateSlug: string;
}

export class UnitSlugDto {
  @ApiProperty({ description: 'The slug for the unit' })
  @IsString()
  @IsNotEmpty()
  readonly unitSlug: string;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
