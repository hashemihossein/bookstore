import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsStrongPassword,
} from 'class-validator';

export class SignupDto {
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
}
