import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  Min,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class AddToCartDto {
  @ApiProperty({
    example: '66c47d7b6022e24dbe00c9fb',
    description:
      'Id of the book that the user wants to add to his/her shopping cart',
  })
  @IsNotEmpty()
  @IsMongoId()
  readonly book: Types.ObjectId;

  @ApiProperty({
    example: 5,
    description:
      'quantity of the book that the user wants to add to his/her shopping cart',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly quantity: number = 1;
}
