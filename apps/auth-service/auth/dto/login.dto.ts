import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'Admin@Admin.com',
    description: 'Email must be valid',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '@Admin1234',
    description: 'Password must be strong',
  })
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;
}
