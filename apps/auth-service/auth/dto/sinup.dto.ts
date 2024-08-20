import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsStrongPassword,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'Test',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Test@Test.com',
    description: 'Email must be valid',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '@Test1234',
    description: 'Password must be strong',
  })
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  password: string;
}
