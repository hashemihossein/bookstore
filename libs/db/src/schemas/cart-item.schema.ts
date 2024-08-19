import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Book } from './book.schema';
import { Cart } from './cart.schema';

@Schema({ timestamps: true })
export class CartItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Book', required: true })
  book: Book;

  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Cart', required: true })
  cart: Cart;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
