import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  description: string;

  @Prop()
  genre: string;

  @Prop()
  releaseDate: Date;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, default: false })
  isPremium: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
