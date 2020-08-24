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
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(40)
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
  @IsNotEmpty()
  readonly password: string;  
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}