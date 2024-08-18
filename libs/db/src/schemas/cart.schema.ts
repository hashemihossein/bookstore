import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItem, CartItemSchema } from './cart-item.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: User, ref: 'User', required: true })
  user: User;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ default: 0 })
  totalItems: number;

  @Prop({ default: 0 })
  totalPrice: number;

  @Prop({ required: true, default: 'pending' })
  status: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
