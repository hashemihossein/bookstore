import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  newPassword: string;
}
