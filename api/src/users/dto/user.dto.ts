import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsIn,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../interfaces/user.interface';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsIn(['owner', 'admin', 'user', 'observer'])
  readonly role: string;

  @ApiProperty()
  @IsBoolean()
  readonly ssoBypass: boolean;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  readonly memberships: string[];
}

export class EditUserDto extends CreateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly name: string;
}

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UserList extends EditUserDto {
  readonly _id: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(40)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}

export class UserChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly oldPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(40)
  readonly newPassword: string;
}

export class UserSelfChangeDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly trackMe?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;
}

export class CreateTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
export class DeleteTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly _id: string;
}
