import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Book } from './book.schema';

@Schema({ timestamps: true })
export class CartItem extends Document {
  @Prop({ type: Book, ref: 'Book', required: true })
  book: Book;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  total: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
