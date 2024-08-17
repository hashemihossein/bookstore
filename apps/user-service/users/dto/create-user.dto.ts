import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsStrongPassword,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsBoolean()
  isPremium: boolean;
}
