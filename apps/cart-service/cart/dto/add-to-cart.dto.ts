import { IsNotEmpty, IsNumber, IsMongoId, Min } from 'class-validator';
import { Types } from 'mongoose';

export class AddToCartDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly book: Types.ObjectId;

  @IsNumber()
  @Min(1)
  readonly quantity: number = 1;
}
