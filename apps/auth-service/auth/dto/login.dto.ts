import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsStrongPassword,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;
}
