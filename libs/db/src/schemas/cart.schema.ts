import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItem } from './cart-item.schema';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'CartItem' }], default: [] })
  items: CartItem[];

  @Prop({ required: true, default: 'cart' })
  status: string;

  @Prop()
  autority: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
