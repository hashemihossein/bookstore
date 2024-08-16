import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Book extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  genre: string;

  @Prop()
  releaseDate: Date;

  @Prop({ required: true, min: 0 })
  price: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
